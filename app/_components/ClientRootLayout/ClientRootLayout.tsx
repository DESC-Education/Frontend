"use client";
import { useTypesDispatch } from "@/app/_hooks/useTypesDispatch";
import { useTypesSelector } from "@/app/_hooks/useTypesSelector";
import { getProfile } from "@/app/_http/API/profileApi";
import { auth } from "@/app/_http/API/userApi";
import { contentSlice } from "@/app/_store/reducers/contentSlice";
import { userSlice } from "@/app/_store/reducers/userSlice";
import LocalStorage from "@/app/_utils/LocalStorage";
import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { $authHost } from "@/app/_http";
import {
    SSEEvents,
    SSENewMessagePayload,
    SSENotificationPayload,
    SSEResponse,
} from "@/app/_http/types";
import { chatSlice } from "@/app/_store/reducers/chatSlice";
import { taskSlice } from "@/app/_store/reducers/taskSlice";
import { MAX_REPLY_COUNT } from "@/app/_utils/constants";

type ClientRootLayoutProps = {
    children: React.ReactNode;
};

declare global {
    interface Window {
        opera: any;
    }
}

const ClientRootLayout: FC<ClientRootLayoutProps> = ({ children }) => {
    const dispatch = useTypesDispatch();
    const { isAuth, isProfileLoading, user } = useTypesSelector(
        (state) => state.userReducer,
    );
    const { unreadChatsCount } = useTypesSelector((state) => state.chatReducer);
    const {
        authUser,
        updateProfile,
        updateIsProfileLoading,
        updateStudentProfileLevel,
    } = userSlice.actions;
    const {
        updateIsLoading,
        updateIsMobileDevice,
        updateIsProfileInfoChanged,
        addNotification,
        updateNotifications,
        updateReplyCount,
        updateScreenWidth,
    } = contentSlice.actions;
    const {
        updateLastMessage,
        updateChatUnread,
        updateUnreadChatsCount,
        updateLastMessageViewed,
        tryToAddChat,
        updateIsRead,
    } = chatSlice.actions;
    const { updateCurrentTaskSolution, addCurrentTaskSolution } =
        taskSlice.actions;

    const [isInitialRun, setIsInitialRun] = useState(true);

    const isChanged = useRef<boolean>();

    // Updating screenWidth variable
    useEffect(() => {
        dispatch(updateScreenWidth(window.innerWidth));

        const listener = (e: any) => {
            dispatch(updateScreenWidth(e.target.innerWidth));
        };
        window.addEventListener("resize", listener);
    }, []);

    // SSE Setup
    useEffect(() => {
        if (isAuth === false || !LocalStorage.getAccessToken()) return;

        const asyncFunc = async () => {
            $authHost
                .get("/api/v1/notifications/events", {
                    headers: {
                        Accept: "text/event-stream",
                    },
                    responseType: "stream",
                    adapter: "fetch",
                })
                .then(async (response) => {
                    if (!response?.data) return;

                    const stream = response.data;

                    const reader = stream
                        .pipeThrough(new TextDecoderStream())
                        .getReader();

                    while (true) {
                        const {
                            value,
                            done,
                        }: {
                            value: string;
                            done: boolean;
                        } = await reader.read();

                        try {
                            const lines = value.trim().split("\n");

                            const result: any = {} as SSEResponse;

                            lines.forEach((line) => {
                                const semIndex = line.indexOf(":");
                                const [key, value] = [
                                    line.slice(0, semIndex).trim(),
                                    line.slice(semIndex + 1).trim(),
                                ];
                                if (key && value) {
                                    if (key === "data") {
                                        result[key] = JSON.parse(value) as
                                            | SSENotificationPayload
                                            | SSENewMessagePayload;
                                    } else if (key === "event") {
                                        result[key] = value as SSEEvents;
                                    }
                                }
                            });

                            // SSE Events
                            switch (result.event) {
                                case "notification":
                                    // payload:
                                    // type: SSENotificationTypes;
                                    // id: string;
                                    // title: string;
                                    // message: string;
                                    // payload: string;
                                    dispatch(
                                        addNotification({
                                            ...result.data,
                                            isRead: false,
                                        }),
                                    );
                                    switch (result.data.type) {
                                        case "verification": {
                                            const profileRes =
                                                await getProfile();

                                            if (profileRes.status === 200) {
                                                dispatch(
                                                    updateProfile({
                                                        ...profileRes.profile!,
                                                        telegramLink:
                                                            profileRes.profile!
                                                                .telegramLink
                                                                ? profileRes.profile!.telegramLink.slice(
                                                                      13,
                                                                  )
                                                                : undefined,
                                                        vkLink: profileRes.profile!
                                                            .vkLink
                                                            ? profileRes.profile!.vkLink.slice(
                                                                  15,
                                                              )
                                                            : undefined,
                                                    }),
                                                );
                                            }
                                            break;
                                        }
                                        case "evaluation": {
                                            dispatch(
                                                updateCurrentTaskSolution(
                                                    result.data.payload,
                                                ),
                                            );
                                            break;
                                        }
                                        case "solution": {
                                            dispatch(
                                                addCurrentTaskSolution(
                                                    result.data.payload,
                                                ),
                                            );
                                            break;
                                        }
                                        case "review": {
                                            dispatch(
                                                updateCurrentTaskSolution(
                                                    result.data.payload,
                                                ),
                                            );
                                            break;
                                        }
                                        case "countReset": {
                                            dispatch(
                                                updateReplyCount(
                                                    MAX_REPLY_COUNT,
                                                ),
                                            );
                                            break;
                                        }
                                        case "level": {
                                            dispatch(
                                                updateStudentProfileLevel(
                                                    result.data.payload,
                                                ),
                                            );
                                            break;
                                        }
                                    }
                                    break;
                                case "newMessage":
                                    // payload:
                                    // chat: "68577bd8-1f40-464e-8f58-a4b709c73b6b"
                                    // createdAt: "2024-10-03T17:39:03.961803"
                                    // message: "sdvdfvdf"
                                    // unreadChatsCount: 1
                                    // unreadCount: 1
                                    dispatch(
                                        updateLastMessage({
                                            chatId: result.data.chat,
                                            message: {
                                                ...result.data,
                                                message: result.data.message,
                                                createdAt:
                                                    result.data.createdAt,
                                            },
                                            myMessage: false,
                                        }),
                                    );
                                    dispatch(
                                        updateChatUnread({
                                            chatId: result.data.chat,
                                            count: result.data.unreadCount,
                                        }),
                                    );
                                    dispatch(
                                        updateUnreadChatsCount({
                                            number: result.data
                                                .unreadChatsCount,
                                        }),
                                    );
                                    break;
                                case "newChat":
                                    // payload: IChat
                                    dispatch(
                                        updateUnreadChatsCount({
                                            number: unreadChatsCount + 1,
                                        }),
                                    );
                                    dispatch(tryToAddChat(result.data));
                                    break;
                                case "viewed":
                                    // payload:
                                    // chat: "68577bd8-1f40-464e-8f58-a4b709c73b6b"
                                    // createdAt: "2024-10-03T17:39:03.961803"
                                    // (messageId)id: "68577bd8-1f40-464e-8f58-a4b709c73b6b"
                                    // message: "sdvdfvdf"
                                    // unreadChatsCount: 1
                                    // unreadCount: 1
                                    dispatch(
                                        updateChatUnread({
                                            chatId: result.data.chat,
                                            count: result.data.unreadCount,
                                        }),
                                    );
                                    dispatch(
                                        updateUnreadChatsCount({
                                            number: result.data
                                                .unreadChatsCount,
                                        }),
                                    );
                                    dispatch(
                                        updateLastMessageViewed(
                                            result.data.chat,
                                        ),
                                    );
                                    dispatch(updateIsRead(result.data.id));
                                    break;
                            }
                        } catch (error) {}

                        if (done) break;
                    }
                });
        };
        asyncFunc();
    }, [isAuth]);

    // Setting "isMobile" flag
    useEffect(() => {
        const isMobile = () => {
            let check = false;
            (function (a) {
                if (
                    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
                        a,
                    ) ||
                    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                        a.substr(0, 4),
                    )
                )
                    check = true;
            })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        };

        dispatch(updateIsMobileDevice(isMobile()));

        // Changes not saved logic
        dispatch(updateIsProfileInfoChanged(isChanged));
    }, []);

    // Auth Setup
    useEffect(() => {
        if (!isInitialRun) return;

        const asyncFunc = async () => {
            const token = LocalStorage.getAccessToken();

            if (token && !isAuth) {
                const res = await auth();

                if (res.status === 200) {
                    dispatch(authUser({ user: res.user! }));

                    dispatch(updateNotifications(res.notifications!));
                    dispatch(
                        updateUnreadChatsCount({
                            number: res.unreadChatsCount!,
                        }),
                    );

                    if (res.user!.role === "student") {
                        const profile = await getProfile();

                        // Profile Setup
                        if (profile.status === 200) {
                            if (
                                profile.profile.verification.status !==
                                "not_verified"
                            ) {
                                dispatch(
                                    updateProfile({
                                        ...profile.profile!,
                                        telegramLink: profile.profile!
                                            .telegramLink
                                            ? profile.profile!.telegramLink.slice(
                                                  13,
                                              )
                                            : undefined,
                                        vkLink: profile.profile!.vkLink
                                            ? profile.profile!.vkLink.slice(15)
                                            : undefined,
                                    }),
                                );
                            }
                        }
                        dispatch(updateIsProfileLoading(false));
                    }
                }
            }
            dispatch(updateIsLoading(false));
            setIsInitialRun(false);
        };
        asyncFunc();
    }, [isInitialRun, user.role]);

    // Get profile setup
    useEffect(() => {
        if (isInitialRun || (isAuth && !isProfileLoading)) return;

        const asyncFunc = async () => {
            const token = LocalStorage.getAccessToken();

            if (token && isAuth) {
                const profile = await getProfile();
                if (profile.status === 200) {
                    dispatch(
                        updateProfile({
                            ...profile.profile!,
                            telegramLink: profile.profile!.telegramLink
                                ? profile.profile!.telegramLink.slice(13)
                                : undefined,
                            vkLink: profile.profile!.vkLink
                                ? profile.profile!.vkLink.slice(15)
                                : undefined,
                        }),
                    );
                }
                dispatch(updateIsProfileLoading(false));
            }
            dispatch(updateIsLoading(false));
        };
        asyncFunc();
    }, [isAuth, isInitialRun, isProfileLoading]);

    return children;
};

export default ClientRootLayout;
