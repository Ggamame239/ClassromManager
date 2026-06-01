
import { useEffect, useState } from "react";

import { initializeApp } from "firebase/app";

import {
  Moon,
  Sun,
  Languages,
  ChevronDown,
  Clock3,
  BookOpen,
} from "lucide-react";

import {
  getDatabase,
  ref,
  onValue,
  push,
  remove,
  get,
} from "firebase/database";

import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";


/* =========================
   FIREBASE
========================= */

const firebaseConfig = {
  apiKey: "AIzaSyBjqCdppOogoGa17Uztv-LGN1MQLV7qN4E",
  authDomain: "classroommanager-7bd47.firebaseapp.com",
  databaseURL: "https://classroommanager-7bd47-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "classroommanager-7bd47",
  storageBucket: "classroommanager-7bd47.firebasestorage.app",
  messagingSenderId: "966553060656",
  appId: "1:966553060656:web:3fced182fb99c2356bf4f5",
  measurementId: "G-HPKZNH8LES"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);
console.log(storage);

export default function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] =
    useState(false);

  const [loginData, setLoginData] =
    useState({
      studentNo: "",
      password: "",
    });

  const [registerData, setRegisterData] =
    useState({
      name: "",
      studentNo: "",
      password: "",
      profileImage: "",
    });

  const [profileFile, setProfileFile] = useState(null);
  const [profileImage, setProfileImage] = useState("");
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

  const registerUser = async () => {

    await push(
      ref(db, "users"),
      {
        name: registerData.name,
        studentNo: registerData.studentNo,
        password: registerData.password,
        profileImage,
        role: "student",
      }
    );

    alert("สมัครสมาชิกสำเร็จ");
  };
  const login = async () => {

    const snapshot =
      await get(ref(db, "users"));

    const data =
      snapshot.val() || {};

    const found =
      Object.entries(data).find(
        ([id, value]) =>
          value.studentNo ===
          loginData.studentNo &&
          value.password ===
          loginData.password
      );

    if (!found) {

      alert("เลขที่หรือรหัสผ่านไม่ถูกต้อง");
      return;

    }

    const [id, value] = found;

    setUser({
      id,
      ...value,
    });

    localStorage.setItem(
      "class22-user",
      JSON.stringify({
        id,
        ...value,
      })
    );

  };

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

  useEffect(() => {

    const saved =
      localStorage.getItem(
        "class22-user"
      );

    if (saved) {
      setUser(JSON.parse(saved));
    }

    const savedTheme =
      localStorage.getItem(
        "class22-theme"
      );

    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else {
      setDarkMode(
        window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches
      );
    }

  }, []);

  useEffect(() => {
    localStorage.setItem(
      "class22-theme",
      darkMode ? "dark" : "light"
    );

    if (darkMode) {
      document.documentElement.classList.add(
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );
    }
  }, [darkMode]);

  const logout = () => {

    localStorage.removeItem(
      "class22-user"
    );

    setUser(null);

  };

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

  const deleteItem = (path, id) => {
    remove(ref(db, `${path}/${id}`));
  };

  /* =========================
     THEME
  ========================= */

  const bg = darkMode
    ? "bg-zinc-950 text-white"
    : "bg-gradient-to-br from-sky-50 via-white to-indigo-50 text-slate-900";

  const card = darkMode
    ? "bg-zinc-900/80 border-zinc-800 backdrop-blur"
    : "bg-white/70 border-white/50 backdrop-blur-xl shadow-xl";

  const subText = darkMode
    ? "text-zinc-400"
    : "text-slate-500";

  const loginBg = darkMode
    ? "bg-zinc-950 text-white"
    : "bg-slate-100 text-slate-900";

  const loginCard = darkMode
    ? "bg-zinc-900 text-white border border-zinc-800"
    : "bg-white text-slate-900 border border-slate-200 shadow-xl";

  const loginInput = darkMode
    ? "bg-zinc-800 text-white placeholder:text-zinc-400 border border-zinc-700"
    : "bg-slate-100 text-slate-900 placeholder:text-slate-500 border border-slate-200";

  const formInput = darkMode
    ? "bg-zinc-800 text-white placeholder:text-zinc-400 border border-zinc-700"
    : "bg-slate-100 text-slate-900 placeholder:text-slate-500 border border-slate-200";

  const formSelect = darkMode
    ? "bg-zinc-800 text-white border border-zinc-700"
    : "bg-slate-100 text-slate-900 border border-slate-200";

  if (!user) {

    return (

      <div className={`min-h-screen flex items-center justify-center ${loginBg}`}>

        <div className={`p-8 rounded-3xl w-full max-w-md ${loginCard}`}>

          <h1 className="text-3xl font-black mb-6">
            ใครเอ่ย รายงานตัวหน่อย!
          </h1>

          {!showRegister ? (

            <>
              <h2 className="text-xl mb-4">
                เข้าสู่ระบบ
              </h2>

              <input
                placeholder="เลขที่"
                className={`w-full p-4 rounded-2xl mb-3 ${loginInput}`}
                value={loginData.studentNo}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    studentNo: e.target.value
                  })
                }
              />

              <input
                type="password"
                placeholder="รหัสผ่าน"
                className={`w-full p-4 rounded-2xl mb-3 ${loginInput}`}
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    password: e.target.value
                  })
                }
              />

              <button
                onClick={login}
                className="w-full bg-blue-600 p-4 rounded-2xl font-bold"
              >
                เข้าสู่ระบบ
              </button>

              <button
                onClick={() => setShowRegister(true)}
                className="w-full mt-3 text-blue-400"
              >
                สมัครสมาชิก
              </button>
            </>

          ) : (

            <>
              <h2 className="text-xl mb-4">
                สมัครสมาชิก
              </h2>

              <input
                placeholder="ชื่อ"
                className={`w-full p-4 rounded-2xl mb-3 ${loginInput}`}
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    name: e.target.value
                  })
                }
              />

              <input
                placeholder="เลขที่"
                className={`w-full p-4 rounded-2xl mb-3 ${loginInput}`}
                value={registerData.studentNo}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    studentNo: e.target.value
                  })
                }
              />

              <input
                type="password"
                placeholder="รหัสผ่าน"
                className={`w-full p-4 rounded-2xl mb-3 ${loginInput}`}
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    password: e.target.value
                  })
                }
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (!file) return;

                  const reader = new FileReader();

                  reader.onloadend = () => {
                    setProfileImage(reader.result);
                  };

                  reader.readAsDataURL(file);

                  setProfileFile(file);
                }}
              />

              <button
                onClick={registerUser}
                className="w-full bg-green-600 p-4 rounded-2xl font-bold"
              >
                สมัครสมาชิก
              </button>

              <button
                onClick={() => setShowRegister(false)}
                className="w-full mt-3 text-zinc-400"
              >
                กลับหน้า Login
              </button>
            </>

          )}

        </div>

      </div>

    );

  }

  return (
    <div className={`${bg} min-h-screen p-4 lg:p-8 transition-all duration-300`}>

      {/* HEADER */}
      <div className={`${card} border rounded-[32px] p-6 mb-6`}>
        <div className="flex justify-between items-start">

          <div className="flex items-center gap-3">

            <div>
              <h1 className="text-3xl lg:text-5xl font-black tracking-tight">
                Main Dashboard
              </h1>
              <div className={`${subText} mt-4 text-sm lg:text-base flex items-center gap-3`}>
                <div className="h-12 w-12 rounded-full overflow-hidden bg-zinc-700 flex items-center justify-center text-white font-bold">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{user.name ? user.name.charAt(0) : "U"}</span>
                  )}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-semibold text-sm">
                    {user.name || `นักเรียน ${user.studentNo}`}
                  </span>
                  <span className="text-[11px] text-slate-300">
                    เลขที่ {user.studentNo}
                  </span>
                  <button
                  onClick={logout}
                  className="mt-2 text-xs text-red-300 hover:text-red-100"
                >
                  ออกจากระบบ
                </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-4xl lg:text-5xl font-black tracking-tight">
              {time.toLocaleTimeString("th-TH", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className={`${subText} mt-2 text-sm`}>
              {todayName}
            </div>

          </div> 
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-6 flex-wrap">

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center gap-2 shadow-lg hover:scale-105 transition"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <button
            onClick={() => setLanguage(language === "th" ? "en" : "th")}
            className="px-5 py-3 rounded-2xl bg-white text-slate-800 border border-slate-200 flex items-center gap-2 shadow-md hover:scale-105 transition"
          >
            <Languages size={18} />
            {language === "th" ? "ไทย" : "English"}
          </button>

        </div>
      </div>

      {/* ADMIN */}
      <div className={`${card} border rounded-3xl p-6 mb-6`}>
        <details>
          <summary className="cursor-pointer text-2xl font-bold">
            ⚙ จัดการข้อมูล
          </summary>

          <div className="mt-6 space-y-8">

            {/* ASSIGNMENT */}
            <div>
              <h3 className="text-xl font-bold mb-4">เพิ่มงาน</h3>

              <div className="grid md:grid-cols-4 gap-4">
                <input
                  placeholder="ชื่องาน"
                  className={`${formInput} rounded-2xl p-4`}
                  value={assignmentForm.title}
                  onChange={(e) =>
                    setAssignmentForm({ ...assignmentForm, title: e.target.value })
                  }
                />

                <input
                  placeholder="วิชา"
                  className={`${formInput} rounded-2xl p-4`}
                  value={assignmentForm.subject}
                  onChange={(e) =>
                    setAssignmentForm({ ...assignmentForm, subject: e.target.value })
                  }
                />

                <input
                  placeholder="กำหนดส่ง"
                  className={`${formInput} rounded-2xl p-4`}
                  value={assignmentForm.due}
                  onChange={(e) =>
                    setAssignmentForm({ ...assignmentForm, due: e.target.value })
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
              <h3 className="text-xl font-bold mb-4">เพิ่มประกาศ</h3>

              <div className="flex gap-4 flex-col md:flex-row">
                <input
                  placeholder="พิมพ์ประกาศ"
                  className={`${formInput} rounded-2xl p-4 flex-1`}
                  value={announcementForm}
                  onChange={(e) => setAnnouncementForm(e.target.value)}
                />

                <button
                  onClick={addAnnouncement}
                  className="bg-yellow-500 text-black rounded-2xl px-6 py-4 font-bold"
                >
                  เพิ่ม
                </button>
              </div>
            </div>

            {/* SCHEDULE FORM */}
            <div>
              <h3 className="text-xl font-bold mb-4">เพิ่มตารางเรียน</h3>

              <div className="grid md:grid-cols-5 gap-4">

                <select
                  className={`${formSelect} rounded-2xl p-4`}
                  value={scheduleForm.day}
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, day: e.target.value })
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
                  className={`${formInput} rounded-2xl p-4`}
                  value={scheduleForm.subject}
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, subject: e.target.value })
                  }
                />

                <input
                  placeholder="ครู"
                  className={`${formInput} rounded-2xl p-4`}
                  value={scheduleForm.teacher}
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, teacher: e.target.value })
                  }
                />

                <input
                  placeholder="08:00"
                  className={`${formInput} rounded-2xl p-4`}
                  value={scheduleForm.start}
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, start: e.target.value })
                  }
                />

                <input
                  placeholder="09:00"
                  className={`${formInput} rounded-2xl p-4`}
                  value={scheduleForm.end}
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, end: e.target.value })
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
      <div className="bg-green-600 rounded-3xl p-8 text-white mb-6">
        <div className="uppercase opacity-80 tracking-widest text-sm">
          {t.currentClass}
        </div>

        <div className="mt-4 text-5xl font-black">
          {currentClass ? currentClass.subject : t.noClass}
        </div>

        <div className="mt-3 text-2xl opacity-90">
          {currentClass ? `${currentClass.start} - ${currentClass.end}` : "--"}
        </div>

        <div className="mt-2 opacity-80">
          {currentClass?.teacher}
        </div>
      </div>

      {/* NEXT CLASS */}
      <div className="bg-blue-600 rounded-3xl p-8 text-white mb-6">
        <div className="uppercase opacity-80 tracking-widest text-sm">
          {t.nextClass}
        </div>

        <div className="mt-4 text-5xl font-black">
          {nextClass ? nextClass.subject : t.noClass}
        </div>

        <div className="mt-3 text-2xl opacity-90">
          {nextClass ? `${nextClass.start} - ${nextClass.end}` : "--"}
        </div>

        <div className="mt-2 opacity-80">
          {nextClass?.teacher}
        </div>
      </div>



      {/* ASSIGNMENTS LIST */}
      <div className={`${card} border rounded-3xl p-6 mb-6`}>
        <details>
          <summary className="cursor-pointer text-2xl font-bold">
            📚 งานที่ต้องส่ง ({assignments.length})
          </summary>

          <div className="space-y-4 mt-6">
            {assignments.length === 0 && (
              <div className={subText}>ไม่มีงาน</div>
            )}

            {assignments.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border flex justify-between items-center ${darkMode ? "bg-zinc-900 border-zinc-800" : "bg-zinc-100 border-zinc-200"
                  }`}
              >
                <div>
                  <div className="font-bold">{item.title}</div>
                  <div className={subText}>{item.subject}</div>
                  <div className="text-yellow-500 text-sm mt-2">{item.due}</div>
                </div>

                <button
                  onClick={() => deleteItem("assignments", item.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
                >
                  ลบ
                </button>
              </div>
            ))}
          </div>
        </details>
      </div>

      {/* ANNOUNCEMENTS LIST */}
      <div className={`${card} border rounded-3xl p-6 mb-6`}>
        <details>
          <summary className="cursor-pointer text-2xl font-bold">
            📢 ประกาศ ({announcements.length})
          </summary>

          <div className="space-y-4 mt-6">
            {announcements.length === 0 && (
              <div className={subText}>ไม่มีประกาศ</div>
            )}

            {announcements.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border flex justify-between items-center ${darkMode ? "bg-zinc-900 border-zinc-800" : "bg-zinc-100 border-zinc-200"
                  }`}
              >
                <div>{item.text}</div>

                <button
                  onClick={() => deleteItem("announcements", item.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
                >
                  ลบ
                </button>
              </div>
            ))}
          </div>
        </details>
      </div>
      {/* TODAY SCHEDULE */}
      <div className={`${card} border rounded-3xl p-6 mb-6`}>
        <button
          onClick={() => setShowSchedule(!showSchedule)}
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
            {todaySchedule.length === 0 && (
              <div className={subText}>ไม่มีคาบเรียนวันนี้</div>
            )}

            {todaySchedule.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border flex justify-between items-center ${darkMode
                    ? "bg-zinc-900 border-zinc-800"
                    : "bg-zinc-100 border-zinc-200"
                  }`}
              >
                <div>
                  <div className="font-bold">{item.subject}</div>
                  <div className={subText}>{item.teacher}</div>
                  <div className="text-sm mt-2">
                    {item.start} - {item.end}
                  </div>
                </div>

                <button
                  onClick={() => deleteItem("schedule", item.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
                >
                  ลบ
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}