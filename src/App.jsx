
import { useEffect, useState } from "react";

import { initializeApp } from "firebase/app";

import {
  getDatabase,
  ref,
  onValue,
  push,
} from "firebase/database";

import {
  Moon,
  Sun,
  Languages,
  ChevronDown,
  Clock3,
  BookOpen,
} from "lucide-react";

/* =========================
   FIREBASE
========================= */

const firebaseConfig = {
  apiKey: "AIzaSyBjqCdppOogoGa17Uztv-LGN1MQLV7qN4E",
  authDomain: "classroommanager-7bd47.firebaseapp.com",
  databaseURL:
    "https://classroommanager-7bd47-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "classroommanager-7bd47",
  storageBucket:
    "classroommanager-7bd47.firebasestorage.app",
  messagingSenderId: "966553060656",
  appId:
    "1:966553060656:web:3fced182fb99c2356bf4f5",
  measurementId: "G-HPKZNH8LES",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function App() {

  /* =========================
     STATE
  ========================= */

  const [darkMode, setDarkMode] =
    useState(true);

  const [language, setLanguage] =
    useState("th");

  const [time, setTime] =
    useState(new Date());

  const [schedule, setSchedule] =
    useState([]);

  const [assignments, setAssignments] =
    useState([]);

  const [announcements, setAnnouncements] =
    useState([]);

  const [showSchedule, setShowSchedule] =
    useState(false);

  /* =========================
     FORMS
  ========================= */

  const [assignmentForm, setAssignmentForm] =
    useState({
      title: "",
      subject: "",
      due: "",
    });

  const [announcementForm, setAnnouncementForm] =
    useState("");

  const [scheduleForm, setScheduleForm] =
    useState({
      day: "จันทร์",
      subject: "",
      teacher: "",
      start: "",
      end: "",
    });

  /* =========================
     TEXT
  ========================= */

  const text = {
    th: {
      nextClass: "คาบถัดไป",
      currentClass: "คาบปัจจุบัน",
      noClass: "ไม่มีคาบเรียน",
      todaySchedule: "ตารางเรียนวันนี้",
      assignments: "งาน",
      announcements: "ประกาศ",
    },

    en: {
      nextClass: "Next Class",
      currentClass: "Current Class",
      noClass: "No Class",
      todaySchedule: "Today Schedule",
      assignments: "Assignments",
      announcements: "Announcements",
    },
  };

  const t = text[language];

  /* =========================
     CLOCK
  ========================= */

  useEffect(() => {

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);

  }, []);

  /* =========================
     FIREBASE
  ========================= */

  useEffect(() => {

    onValue(ref(db, "schedule"), (snapshot) => {

      const data = snapshot.val() || {};

      const list = Object.entries(data).map(
        ([id, value]) => ({
          id,
          ...value,
        })
      );

      setSchedule(list);

    });

    onValue(ref(db, "assignments"), (snapshot) => {

      const data = snapshot.val() || {};

      const list = Object.entries(data).map(
        ([id, value]) => ({
          id,
          ...value,
        })
      );

      setAssignments(list.reverse());

    });

    onValue(ref(db, "announcements"), (snapshot) => {

      const data = snapshot.val() || {};

      const list = Object.entries(data).map(
        ([id, value]) => ({
          id,
          ...value,
        })
      );

      setAnnouncements(list.reverse());

    });

  }, []);

  /* =========================
     TODAY
  ========================= */

  const days = [
    "อาทิตย์",
    "จันทร์",
    "อังคาร",
    "พุธ",
    "พฤหัส",
    "ศุกร์",
    "เสาร์",
  ];

  const todayName =
    days[new Date().getDay()];

  const todaySchedule = schedule.filter(
    (item) => item.day === todayName
  );

  /* =========================
     CURRENT TIME
  ========================= */

  const nowMinutes =
    new Date().getHours() * 60 +
    new Date().getMinutes();

  /* =========================
     CURRENT CLASS
  ========================= */

  const currentClass = todaySchedule.find(
    (item) => {

      if (!item.start || !item.end)
        return false;

      const [sh, sm] =
        item.start.split(":").map(Number);

      const [eh, em] =
        item.end.split(":").map(Number);

      const startMinutes =
        sh * 60 + sm;

      const endMinutes =
        eh * 60 + em;

      return (
        nowMinutes >= startMinutes &&
        nowMinutes <= endMinutes
      );

    }
  );

  /* =========================
     NEXT CLASS
  ========================= */

  const nextClass = todaySchedule.find(
    (item) => {

      const [sh, sm] =
        item.start.split(":").map(Number);

      const startMinutes =
        sh * 60 + sm;

      return startMinutes > nowMinutes;

    }
  );

  /* =========================
     ADD DATA
  ========================= */

  const addAssignment = () => {

    if (!assignmentForm.title) return;

    push(
      ref(db, "assignments"),
      assignmentForm
    );

    setAssignmentForm({
      title: "",
      subject: "",
      due: "",
    });

  };

  const addAnnouncement = () => {

    if (!announcementForm) return;

    push(
      ref(db, "announcements"),
      {
        text: announcementForm,
      }
    );

    setAnnouncementForm("");

  };

  const addSchedule = () => {

    if (!scheduleForm.subject) return;

    push(
      ref(db, "schedule"),
      scheduleForm
    );

    setScheduleForm({
      day: "จันทร์",
      subject: "",
      teacher: "",
      start: "",
      end: "",
    });

  };

  /* =========================
     THEME
  ========================= */

  const bg = darkMode
    ? "bg-black text-white"
    : "bg-zinc-100 text-black";

  const card = darkMode
    ? "bg-zinc-900 border-zinc-800"
    : "bg-white border-zinc-300";

  const subText = darkMode
    ? "text-zinc-400"
    : "text-zinc-600";

  return (

    <div
      className={`${bg} min-h-screen p-4 lg:p-8 transition-all`}
    >

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <div
          className={`${card} border rounded-3xl p-6 mb-6`}
        >

          <div className="flex justify-between items-start">

            <div>

              <h1 className="text-4xl lg:text-5xl font-black">
                /22 CLASS
              </h1>

              <div
                className={`${subText} mt-2 text-lg`}
              >
                Smart Classroom
              </div>

            </div>

            <div className="text-right">

              <div className="text-5xl font-black">

                {time.toLocaleTimeString(
                  "th-TH",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}

              </div>

              <div
                className={`${subText} mt-2`}
              >
                {todayName}
              </div>

            </div>

          </div>

          {/* BUTTONS */}

          <div className="flex gap-3 mt-6">

            <button
              onClick={() =>
                setDarkMode(!darkMode)
              }
              className="px-4 py-3 rounded-2xl bg-blue-600 text-white flex items-center gap-2"
            >

              {darkMode
                ? <Sun size={18} />
                : <Moon size={18} />}

              Theme

            </button>

            <button
              onClick={() =>
                setLanguage(
                  language === "th"
                    ? "en"
                    : "th"
                )
              }
              className="px-4 py-3 rounded-2xl bg-zinc-700 text-white flex items-center gap-2"
            >

              <Languages size={18} />

              {language === "th"
                ? "ไทย"
                : "EN"}

            </button>

          </div>

        </div>

        {/* ADMIN */}

        <div
          className={`${card} border rounded-3xl p-6 mb-6`}
        >

          <details>

            <summary className="cursor-pointer text-2xl font-bold">

              ⚙ จัดการข้อมูล

            </summary>

            <div className="mt-6 space-y-8">

              {/* ASSIGNMENT */}

              <div>

                <h3 className="text-xl font-bold mb-4">
                  เพิ่มงาน
                </h3>

                <div className="grid md:grid-cols-4 gap-4">

                  <input
                    placeholder="ชื่องาน"
                    className="bg-zinc-800 rounded-2xl p-4"
                    value={assignmentForm.title}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        title: e.target.value,
                      })
                    }
                  />

                  <input
                    placeholder="วิชา"
                    className="bg-zinc-800 rounded-2xl p-4"
                    value={assignmentForm.subject}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        subject: e.target.value,
                      })
                    }
                  />

                  <input
                    placeholder="กำหนดส่ง"
                    className="bg-zinc-800 rounded-2xl p-4"
                    value={assignmentForm.due}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        due: e.target.value,
                      })
                    }
                  />

                  <button
                    onClick={addAssignment}
                    className="bg-blue-600 rounded-2xl p-4 font-bold"
                  >
                    เพิ่มงาน
                  </button>

                </div>

              </div>

              {/* ANNOUNCEMENT */}

              <div>

                <h3 className="text-xl font-bold mb-4">
                  เพิ่มประกาศ
                </h3>

                <div className="flex gap-4 flex-col md:flex-row">

                  <input
                    placeholder="พิมพ์ประกาศ"
                    className="bg-zinc-800 rounded-2xl p-4 flex-1"
                    value={announcementForm}
                    onChange={(e) =>
                      setAnnouncementForm(
                        e.target.value
                      )
                    }
                  />

                  <button
                    onClick={addAnnouncement}
                    className="bg-yellow-500 text-black rounded-2xl px-6 py-4 font-bold"
                  >
                    เพิ่ม
                  </button>

                </div>

              </div>

              {/* SCHEDULE */}

              <div>

                <h3 className="text-xl font-bold mb-4">
                  เพิ่มตารางเรียน
                </h3>

                <div className="grid md:grid-cols-5 gap-4">

                  <select
                    className="bg-zinc-800 rounded-2xl p-4"
                    value={scheduleForm.day}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        day: e.target.value,
                      })
                    }
                  >

                    <option>จันทร์</option>
                    <option>อังคาร</option>
                    <option>พุธ</option>
                    <option>พฤหัส</option>
                    <option>ศุกร์</option>

                  </select>

                  <input
                    placeholder="วิชา"
                    className="bg-zinc-800 rounded-2xl p-4"
                    value={scheduleForm.subject}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        subject: e.target.value,
                      })
                    }
                  />

                  <input
                    placeholder="ครู"
                    className="bg-zinc-800 rounded-2xl p-4"
                    value={scheduleForm.teacher}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        teacher: e.target.value,
                      })
                    }
                  />

                  <input
                    placeholder="08:00"
                    className="bg-zinc-800 rounded-2xl p-4"
                    value={scheduleForm.start}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        start: e.target.value,
                      })
                    }
                  />

                  <input
                    placeholder="09:00"
                    className="bg-zinc-800 rounded-2xl p-4"
                    value={scheduleForm.end}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        end: e.target.value,
                      })
                    }
                  />

                </div>

                <button
                  onClick={addSchedule}
                  className="bg-green-600 rounded-2xl px-6 py-4 font-bold mt-4"
                >
                  เพิ่มคาบ
                </button>

              </div>

            </div>

          </details>

        </div>

        {/* CURRENT CLASS */}

        <div
          className="bg-green-600 rounded-3xl p-8 text-white mb-6"
        >

          <div className="uppercase opacity-80 tracking-widest text-sm">

            {t.currentClass}

          </div>

          <div className="mt-4 text-5xl font-black">

            {currentClass
              ? currentClass.subject
              : t.noClass}

          </div>

          <div className="mt-3 text-2xl opacity-90">

            {currentClass
              ? `${currentClass.start} - ${currentClass.end}`
              : "--"}

          </div>

          <div className="mt-2 opacity-80">

            {currentClass?.teacher}

          </div>

        </div>

        {/* NEXT CLASS */}

        <div
          className="bg-blue-600 rounded-3xl p-8 text-white mb-6"
        >

          <div className="uppercase opacity-80 tracking-widest text-sm">

            {t.nextClass}

          </div>

          <div className="mt-4 text-5xl font-black">

            {nextClass
              ? nextClass.subject
              : t.noClass}

          </div>

          <div className="mt-3 text-2xl opacity-90">

            {nextClass
              ? `${nextClass.start} - ${nextClass.end}`
              : "--"}

          </div>

          <div className="mt-2 opacity-80">

            {nextClass?.teacher}

          </div>

        </div>

        {/* SCHEDULE */}

        <div
          className={`${card} border rounded-3xl p-6 mb-6`}
        >

          <button
            onClick={() =>
              setShowSchedule(!showSchedule)
            }
            className="w-full flex justify-between items-center"
          >

            <div className="flex items-center gap-3">

              <Clock3 />

              <h2 className="text-2xl font-bold">

                {t.todaySchedule}

              </h2>

            </div>

            <ChevronDown />

          </button>

          {showSchedule && (

            <div className="space-y-4 mt-6">

              {todaySchedule.map((item) => (

                <div
                  key={item.id}
                  className={
                    darkMode
                      ? "bg-zinc-800 rounded-2xl p-4"
                      : "bg-zinc-100 rounded-2xl p-4"
                  }
                >

                  <div className="flex justify-between">

                    <div>

                      <div className="text-xl font-bold">
                        {item.subject}
                      </div>

                      <div className={subText}>
                        {item.teacher}
                      </div>

                    </div>

                    <div className="text-right">

                      <div>
                        {item.start}
                      </div>

                      <div className={subText}>
                        {item.end}
                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>

  );
}
