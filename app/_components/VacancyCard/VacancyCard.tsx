// "use client";

// import { IVacancy } from "@/app/_types";
// import classNames from "classnames";
// import styles from "./VacancyCard.module.scss";
// import Image from "next/image";
// import Link from "next/link";
// import Moment from "react-moment";
// import { formatSalary } from "@/app/_utils/formatSalary";

// interface VacancyCardProps {
//     vacancy: IVacancy;
//     isVacancyPage?: boolean;
// }

// const VacancyCard = ({ vacancy, isVacancyPage = false }: VacancyCardProps) => {
//     const {
//         id,
//         companyProfile,
//         title,
//         description,
//         salary,
//         location,
//         employmentType,
//         experienceLevel,
//         skills,
//         category,
//         createdAt,
//         deadline,
//         applicationsCount,
//     } = vacancy;

//     const getEmploymentTypeText = (type: string) => {
//         switch (type) {
//             case "full_time":
//                 return "Полная занятость";
//             case "part_time":
//                 return "Частичная занятость";
//             case "remote":
//                 return "Удаленная работа";
//             case "hybrid":
//                 return "Гибрид";
//             default:
//                 return type;
//         }
//     };

//     const getExperienceLevelText = (level: string) => {
//         switch (level) {
//             case "intern":
//                 return "Стажер";
//             case "junior":
//                 return "Junior";
//             case "middle":
//                 return "Middle";
//             case "senior":
//                 return "Senior";
//             default:
//                 return level;
//         }
//     };

//     return (
//         <div className={classNames(styles.vacancyCard, { [styles.isVacancyPage]: isVacancyPage })}>
//             <div className={styles.header}>
//                 <div className={styles.companyInfo}>
//                     <div className={styles.logo}>
//                         <Image
//                             src={companyProfile.logoImg || "/images/default-company-logo.png"}
//                             alt={companyProfile.companyName}
//                             width={48}
//                             height={48}
//                             className={styles.companyLogo}
//                         />
//                     </div>
//                     <div className={styles.companyDetails}>
//                         <h3 className={classNames(styles.companyName, "text fz18 fw500")}>
//                             {companyProfile.companyName}
//                         </h3>
//                         <p className={classNames(styles.location, "text fz14 gray")}>
//                             📍 {location.name}
//                         </p>
//                     </div>
//                 </div>
//                 <div className={styles.salary}>
//                     <span className={classNames(styles.salaryText, "text fz18 fw600")}>
//                         {formatSalary(salary.min, salary.max, salary.currency)}
//                     </span>
//                 </div>
//             </div>

//             <div className={styles.content}>
//                 <Link href={`/vacancies/${id}`} className={styles.titleLink}>
//                     <h2 className={classNames(styles.title, "title fz20 fw600")}>
//                         {title}
//                     </h2>
//                 </Link>
                
//                 <p className={classNames(styles.description, "text fz14 gray")}>
//                     {description.length > 200 
//                         ? `${description.substring(0, 200)}...` 
//                         : description
//                     }
//                 </p>

//                 <div className={styles.tags}>
//                     <span className={classNames(styles.tag, styles.category)}>
//                         {category.name}
//                     </span>
//                     <span className={classNames(styles.tag, styles.employmentType)}>
//                         {getEmploymentTypeText(employmentType)}
//                     </span>
//                     <span className={classNames(styles.tag, styles.experienceLevel)}>
//                         {getExperienceLevelText(experienceLevel)}
//                     </span>
//                 </div>

//                 <div className={styles.skills}>
//                     {skills.slice(0, 3).map((skill) => (
//                         <span key={skill.id} className={classNames(styles.skill, "text fz12")}>
//                             {skill.name}
//                         </span>
//                     ))}
//                     {skills.length > 3 && (
//                         <span className={classNames(styles.skill, styles.moreSkills, "text fz12")}>
//                             +{skills.length - 3}
//                         </span>
//                     )}
//                 </div>
//             </div>

//             <div className={styles.footer}>
//                 <div className={styles.meta}>
//                     <span className={classNames(styles.date, "text fz12 gray")}>
//                         📅 Опубликовано <Moment fromNow>{createdAt}</Moment>
//                     </span>
//                     {deadline && (
//                         <span className={classNames(styles.deadline, "text fz12 gray")}>
//                             ⏰ До <Moment format="DD.MM.YYYY">{deadline}</Moment>
//                         </span>
//                     )}
//                 </div>
//                 <div className={styles.applications}>
//                     <span className={classNames(styles.applicationsCount, "text fz12 gray")}>
//                         👥 {applicationsCount} заявок
//                     </span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default VacancyCard; 