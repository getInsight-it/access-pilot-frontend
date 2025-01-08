// import React, {
//   Dispatch,
//   SetStateAction,
//   SyntheticEvent,
//   useState,
//   useEffect,
// } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { format, parse } from "date-fns";
// import { ptBR } from "date-fns/locale/pt-BR";
// import { DateObj, useDayzed } from "dayzed";
// import { ArrowLeft, ArrowRight, Edit } from 'lucide-react';

// export const FlipCalendar = ({ initialDate }: { initialDate?: string }) => {
//   return (
//     <div className="md:flex-row">
//       <Calendar initialDate={initialDate} />
//     </div>
//   );
// };

// const Calendar = ({ initialDate }: { initialDate?: string }) => {
//   const [index, setIndex] = useState(0);
//   const [date, setDate] = useState(() => {
//     if (initialDate) {
//       return parse(initialDate, 'dd/MM/yyyy', new Date());
//     }
//     return new Date();
//   });
//   const [visible, setVisible] = useState(true);

//   useEffect(() => {
//     if (initialDate) {
//       const parsedDate = parse(initialDate, 'dd/MM/yyyy', new Date());
//       setDate(parsedDate);
//       setIndex(prev => prev + 1); // Trigger animation
//     }
//   }, [initialDate]);

//   const handleSelectDate = (selectedDate: { date: Date }) => {
//     setDate(selectedDate.date);
//     setIndex((pv) => pv + 1);
//   };

//   return (
//     <div className="relative flex flex-col text-indigo-950">
//       <CalendarDisplay
//         index={index}
//         date={date}
//         visible={visible}
//         setVisible={setVisible}
//       />
//       <AnimatePresence>
//         {!visible && (
//           <DatePicker selected={date} onDateSelected={handleSelectDate} />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// const CalendarDisplay = ({
//   index,
//   date,
//   visible,
//   setVisible,
// }: CalendarDisplayProps) => {
//   return (
//     <div className="w-fit overflow-hidden rounded-[var(--card-border-radius)] border bg-primary">
//       <div className="flex items-center justify-between px-2.5 py-1">
//         <span className="text-center capitalize text-white">
//           {format(date, "LLLL", { locale: ptBR })}
//           {/* -{format(date, "yyyy", { locale: ptBR })} */}
//         </span>
//         <button
//           onClick={() => setVisible((pv) => !pv)}
//           className=" hidden text-white transition-colors hover:text-indigo-200"
//         >
//           {visible ? <Edit className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
//         </button>
//       </div>
//       <div className="relative z-0 h-36 w-52 shrink-0">
//         <AnimatePresence mode="sync">
//           <motion.div
//             style={{
//               clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
//               zIndex: -index,
//               backfaceVisibility: "hidden",
//             }}
//             key={index}
//             transition={{
//               duration: 0.75,
//               ease: "easeInOut",
//             }}
//             initial={{ rotateX: "0deg" }}
//             animate={{ rotateX: "0deg" }}
//             exit={{ rotateX: "-180deg" }}
//             className="absolute inset-0"
//           >
//             <div className="grid h-full w-full place-content-center rounded-[var(--card-rounded-lg)] bg-white text-6xl">
//               {format(date, "d", { locale: ptBR })}
//             </div>
//           </motion.div>
//           <motion.div
//             style={{
//               clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
//               zIndex: index,
//               backfaceVisibility: "hidden",
//             }}
//             key={(index + 1) * 2}
//             initial={{ rotateX: "180deg" }}
//             animate={{ rotateX: "0deg" }}
//             exit={{ rotateX: "0deg" }}
//             transition={{
//               duration: 0.75,
//               ease: "easeInOut",
//             }}
//             className="absolute inset-0"
//           >
//             <div className="relative grid h-full w-full place-content-center rounded-[var(--card-rounded-lg)] bg-white text-6xl">
//               {format(date, "d", { locale: ptBR })}
//               <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs">
//                 {format(date, "yyyy", { locale: ptBR })}
//               </span>
//             </div>
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// const DatePicker = (props: DatePickerProps) => {
//   let { calendars, getBackProps, getForwardProps, getDateProps } =
//     useDayzed(props);

//   const calendar = calendars[0];

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className=" top-0 mt-4 w-fit rounded-[var(--card-border-radius)] border border-primary bg-white p-3 md:absolute md:mt-0 md:translate-x-full"
//     >
//       <div className="mb-2 flex items-center justify-between">
//         <button {...getBackProps({ calendars })}>
//           <ArrowLeft className="text-primary" />
//         </button>
//         <span>
//           {MONTH_NAMES[calendar.month]} {calendar.year}
//         </span>
//         <button {...getForwardProps({ calendars })}>
//           <ArrowRight className="text-primary" />
//         </button>
//       </div>
//       <div key={`${calendar.month}${calendar.year}`} className="w-52">
//         <div className="mb-2 flex">
//           {WEEKDAY_NAMES.map((weekday) => (
//             <div
//               key={`${calendar.month}${calendar.year}${weekday}`}
//               className="block w-[calc(100%_/_7)] text-center text-xs"
//             >
//               {weekday}
//             </div>
//           ))}
//         </div>
//         {calendar.weeks.map((week, weekIndex) =>
//           week.map((dateObj, index) => {
//             let key = `${calendar.month}${calendar.year}${weekIndex}${index}`;
//             if (!dateObj) {
//               return (
//                 <div key={key} className="inline-block w-[calc(100%_/_7)]" />
//               );
//             }
//             let { date, selected } = dateObj;
//             return (
//               <button
//                 className={`inline-block w-[calc(100%_/_7)] rounded text-sm transition-colors ${
//                   selected ? "bg-indigo-500 text-white" : "bg-transparent"
//                 }`}
//                 key={key}
//                 {...getDateProps({ dateObj })}
//               >
//                 {date.getDate()}
//               </button>
//             );
//           })
//         )}
//       </div>
//     </motion.div>
//   );
// };

// interface CalendarDisplayProps {
//   index: number;
//   date: Date;
//   visible: boolean;
//   setVisible: Dispatch<SetStateAction<boolean>>;
// }

// interface DatePickerProps {
//   selected: Date;
//   onDateSelected: (
//     selectedDate: DateObj,
//     event: SyntheticEvent<Element, Event>
//   ) => void;
// }

// const MONTH_NAMES = [
//   "Jan",
//   "Fev",
//   "Mar",
//   "Abr",
//   "Mai",
//   "Jun",
//   "Jul",
//   "Ago",
//   "Set",
//   "Out",
//   "Nov",
//   "Dez",
// ];

// const WEEKDAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];



// full width
import React, {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useState,
  useEffect,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { DateObj, useDayzed } from "dayzed";
import { ArrowLeft, ArrowRight, Edit } from 'lucide-react';

export const FlipCalendar = ({ initialDate }: { initialDate?: string }) => {
  return (
    <div className="md:flex-row">
      <Calendar initialDate={initialDate} />
    </div>
  );
};

const Calendar = ({ initialDate }: { initialDate?: string }) => {
  const [index, setIndex] = useState(0);
  const [date, setDate] = useState(() => {
    if (initialDate) {
      return parse(initialDate, 'dd/MM/yyyy', new Date());
    }
    return new Date();
  });
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (initialDate) {
      const parsedDate = parse(initialDate, 'dd/MM/yyyy', new Date());
      setDate(parsedDate);
      setIndex(prev => prev + 1); // Trigger animation
    }
  }, [initialDate]);

  const handleSelectDate = (selectedDate: { date: Date }) => {
    setDate(selectedDate.date);
    setIndex((pv) => pv + 1);
  };

  return (
    <div className="relative flex flex-col text-indigo-950">
      <CalendarDisplay
        index={index}
        date={date}
        visible={visible}
        setVisible={setVisible}
      />
      <AnimatePresence>
        {!visible && (
          <DatePicker selected={date} onDateSelected={handleSelectDate} />
        )}
      </AnimatePresence>
    </div>
  );
};

const CalendarDisplay = ({
  index,
  date,
  visible,
  setVisible,
}: CalendarDisplayProps) => {
  return (
    <div className="overflow-hidden rounded-[var(--card-border-radius)] border bg-primary">
      <div className="flex items-center justify-between px-2.5 py-1">
        <span className="text-center capitalize text-white">
          {format(date, "LLLL", { locale: ptBR })}
          {/* -{format(date, "yyyy", { locale: ptBR })} */}
        </span>
        <button
          onClick={() => setVisible((pv) => !pv)}
          className=" hidden text-white transition-colors hover:text-indigo-200"
        >
          {visible ? <Edit className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
        </button>
      </div>
      <div className="relative z-0 h-28 w-full shrink-0">
        <AnimatePresence mode="sync">
          <motion.div
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
              zIndex: -index,
              backfaceVisibility: "hidden",
            }}
            key={index}
            transition={{
              duration: 0.75,
              ease: "easeInOut",
            }}
            initial={{ rotateX: "0deg" }}
            animate={{ rotateX: "0deg" }}
            exit={{ rotateX: "-180deg" }}
            className="absolute inset-0"
          >
            <div className="grid h-full w-full place-content-center rounded-[var(--card-rounded-lg)] bg-white text-6xl">
              {format(date, "d", { locale: ptBR })}
            </div>
          </motion.div>
          <motion.div
            style={{
              clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
              zIndex: index,
              backfaceVisibility: "hidden",
            }}
            key={(index + 1) * 2}
            initial={{ rotateX: "180deg" }}
            animate={{ rotateX: "0deg" }}
            exit={{ rotateX: "0deg" }}
            transition={{
              duration: 0.75,
              ease: "easeInOut",
            }}
            className="absolute inset-0"
          >
            <div className="relative grid h-full w-full place-content-center rounded-[var(--card-rounded-lg)] bg-white text-6xl">
              {format(date, "d", { locale: ptBR })}
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs">
                {format(date, "yyyy", { locale: ptBR })}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const DatePicker = (props: DatePickerProps) => {
  let { calendars, getBackProps, getForwardProps, getDateProps } =
    useDayzed(props);

  const calendar = calendars[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className=" top-0 mt-4 w-fit rounded-[var(--card-border-radius)] border border-primary bg-white p-3 md:absolute md:mt-0 md:translate-x-full"
    >
      <div className="mb-2 flex items-center justify-between">
        <button {...getBackProps({ calendars })}>
          <ArrowLeft className="text-primary" />
        </button>
        <span>
          {MONTH_NAMES[calendar.month]} {calendar.year}
        </span>
        <button {...getForwardProps({ calendars })}>
          <ArrowRight className="text-primary" />
        </button>
      </div>
      <div key={`${calendar.month}${calendar.year}`} className="w-52">
        <div className="mb-2 flex">
          {WEEKDAY_NAMES.map((weekday) => (
            <div
              key={`${calendar.month}${calendar.year}${weekday}`}
              className="block w-[calc(100%_/_7)] text-center text-xs"
            >
              {weekday}
            </div>
          ))}
        </div>
        {calendar.weeks.map((week, weekIndex) =>
          week.map((dateObj, index) => {
            let key = `${calendar.month}${calendar.year}${weekIndex}${index}`;
            if (!dateObj) {
              return (
                <div key={key} className="inline-block w-[calc(100%_/_7)]" />
              );
            }
            let { date, selected } = dateObj;
            return (
              <button
                className={`inline-block w-[calc(100%_/_7)] rounded text-sm transition-colors ${
                  selected ? "bg-indigo-500 text-white" : "bg-transparent"
                }`}
                key={key}
                {...getDateProps({ dateObj })}
              >
                {date.getDate()}
              </button>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

interface CalendarDisplayProps {
  index: number;
  date: Date;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

interface DatePickerProps {
  selected: Date;
  onDateSelected: (
    selectedDate: DateObj,
    event: SyntheticEvent<Element, Event>
  ) => void;
}

const MONTH_NAMES = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const WEEKDAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

