import "./styles.css";
import {
  differenceInMinutes,
  addMinutes,
  isBefore,
  isEqual,
  formatISO,
  isAfter,
  parseISO
} from "date-fns";

const settings = {
  firstDay: "monday",
  monday: ["09:00-12:00", "14:00-18:00"],
  tuesday: ["09:00-12:00", "14:00-18:00"],
  wednesday: ["09:00-12:00", "14:00-18:00"],
  thursday: ["09:00-12:00", "14:00-18:00"],
  friday: ["09:00-12:00", "14:00-18:00"],
  saturday: ["09:00-12:00"],
  sunday: [],
  duration: 10
};

const appointments = [
  {
    start: "2022-09-14T09:05:00+02:00",
    end: "2022-09-14T09:15:00+02:00"
  },
  {
    start: "2022-09-14T14:15:00+02:00",
    end: "2022-09-14T14:25:00+02:00"
  }
];

const getFreeSlots = () => {
  const dayOpenHours = settings.monday;

  if (dayOpenHours.length) {
    let slots = dayOpenHours.map((hoursStr) => {
      const hours = hoursStr.split("-");
      const begin = hours[0].split(":");
      const end = hours[1].split(":");

      const chunkBegin = new Date();
      const chunkEnd = new Date();

      chunkBegin.setHours(begin[0]);
      chunkBegin.setMinutes(begin[1]);
      chunkBegin.setSeconds(0);
      chunkEnd.setHours(end[0]);
      chunkEnd.setMinutes(end[1]);
      chunkEnd.setSeconds(0);

      const numberOfSlots =
        differenceInMinutes(chunkEnd, chunkBegin, { roundingMethod: "trunc" }) /
        settings.duration;
      console.log(numberOfSlots);
      const availableSlots = [];

      for (let i = 0; i < numberOfSlots; i++) {
        const startDate = addMinutes(chunkBegin, i * settings.duration);
        const endDate = addMinutes(startDate, settings.duration);

        if (isBefore(endDate, chunkEnd) || isEqual(endDate, chunkEnd)) {
          availableSlots.push({
            startDate: formatISO(startDate),
            endDate: formatISO(endDate)
          });
        }
      }

      return availableSlots;
    });

    console.log(slots.flat());

    const availableSlots = slots.flat().map((s, index) => {
      const sStartDate = parseISO(s.startDate);
      const sEndDate = parseISO(s.endDate);

      return appointments.map((a) => {
        const aStart = parseISO(a.start);
        const aEnd = parseISO(a.end);

        if (
          isEqual(sStartDate, aStart) ||
          (isAfter(aStart, sStartDate) && isBefore(aStart, sEndDate))
        ) {
          console.log(s);
          return undefined;
        } else if (
          isEqual(sEndDate, aEnd) ||
          (isAfter(aEnd, sStartDate) && isBefore(aEnd, sEndDate))
        ) {
          console.log(s);
          return undefined;
        } else {
          return s;
        }
      });
    });

    console.log(availableSlots.flat());
  }
};

export default function App() {
  getFreeSlots();

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
