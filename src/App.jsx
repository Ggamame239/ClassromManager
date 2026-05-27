import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  push,
  remove,
} from "firebase/database";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";

import {
  Clock3,
  BookOpen,
  Bell,
  Wifi,
  Plus,
  Trash2,
} from "lucide-react";

/* =========================
   FIREBASE CONFIG
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
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function SmartClassroomDashboard() {

  const weekdays = [
    "จันทร์",
    "อังคาร",
    "พุธ",
    "พฤหัส",
    "ศุกร์",
  ];

  const [darkMode, setDarkMode] =
    useState(true);

  const [language, setLanguage] =
    useState("th");

  const [time, setTime] =
    useState(new Date());

  const [assignments, setAssignments] =
    useState([]);

  const [announcements, setAnnouncements] =
    useState([]);

  const [schedule, setSchedule] =
    useState([]);

  const [currentClass, setCurrentClass] =
    useState(null);

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
      day: "",
      period: "",
      subject: "",
      teacher: "",
      start: "",
      end: "",
    });

  /* =========================
     LANGUAGE
  ========================= */

  const text = {
    th: {
      dashboard:
        "Smart Classroom Dashboard",

      currentClass: "คาบปัจจุบัน",

      assignments: "งานที่ต้องส่ง",

      announcements: "ประกาศ",

      schedule: "ตารางเรียน",

      status: "สถานะระบบ",

      online: "ออนไลน์",

      add: "เพิ่ม",

      assignment: "ชื่องาน",

      subject: "วิชา",

      due: "กำหนดส่ง",

      teacher: "ครูผู้สอน",

      period: "คาบ",

      day: "วัน",

      start: "เริ่ม",

      end: "จบ",

      announcementPlaceholder:
        "พิมพ์ประกาศ",
    },

    en: {
      dashboard:
        "Smart Classroom Dashboard",

      currentClass: "Current Class",

      assignments: "Assignments",

      announcements: "Announcements",

      schedule: "Schedule",

      status: "System Status",

      online: "ONLINE",

      add: "Add",

      assignment: "Assignment",

      subject: "Subject",

      due: "Due Date",

      teacher: "Teacher",

      period: "Period",

      day: "Day",

      start: "Start",

      end: "End",

      announcementPlaceholder:
        "Type announcement",
    },
  };

  const t = text[language];

  /* =========================
     THEME
  ========================= */

  const bgMain = darkMode
    ? "bg-black text-white"
    : "bg-zinc-100 text-black";

  const cardStyle = darkMode
    ? "bg-zinc-950 border-zinc-800 text-white"
    : "bg-white border-zinc-300 text-black";

  const subText = darkMode
    ? "text-zinc-400"
    : "text-zinc-600";

  const inputStyle = darkMode
    ? "bg-zinc-900 border-zinc-700 text-white"
    : "bg-zinc-50 border-zinc-300 text-black";

  const buttonStyle = darkMode
    ? "border-zinc-700 bg-zinc-900 hover:bg-zinc-800"
    : "border-zinc-300 bg-white hover:bg-zinc-100";

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

    const assignmentsRef =
      ref(db, "assignments");

    const announcementsRef =
      ref(db, "announcements");

    const scheduleRef =
      ref(db, "schedule");

    onValue(assignmentsRef, (snapshot) => {

      const data =
        snapshot.val() || {};

      const list =
        Object.entries(data).map(
          ([id, value]) => ({
            id,
            ...value,
          })
        );

      setAssignments(list.reverse());

    });

    onValue(
      announcementsRef,
      (snapshot) => {

        const data =
          snapshot.val() || {};

        const list =
          Object.entries(data).map(
            ([id, value]) => ({
              id,
              ...value,
            })
          );

        setAnnouncements(
          list.reverse()
        );

      }
    );

    onValue(scheduleRef, (snapshot) => {

      const data =
        snapshot.val() || {};

      const list =
        Object.entries(data).map(
          ([id, value]) => ({
            id,
            ...value,
          })
        );

      setSchedule(list);

    });

  }, []);

  /* =========================
     CURRENT CLASS
  ========================= */

  useEffect(() => {

    const updateCurrentClass = () => {

      const now = new Date();

      const currentHour =
        now.getHours();

      const currentMinute =
        now.getMinutes();

      const currentTime =
        currentHour * 60 +
        currentMinute;

      const days = [
        "อาทิตย์",
        "จันทร์",
        "อังคาร",
        "พุธ",
        "พฤหัส",
        "ศุกร์",
        "เสาร์",
      ];

      const today =
        days[now.getDay()];

      if (
        today === "เสาร์" ||
        today === "อาทิตย์"
      ) {

        setCurrentClass({
          subject: "ไม่มีเรียน",
          teacher: "",
          start: "",
          end: "",
        });

        return;
      }

      const active =
        schedule.find((item) => {

          if (
            item.day !== today
          )
            return false;

          if (
            !item.start ||
            !item.end
          )
            return false;

          const [sh, sm] =
            item.start
              .split(":")
              .map(Number);

          const [eh, em] =
            item.end
              .split(":")
              .map(Number);

          const startMinutes =
            sh * 60 + sm;

          const endMinutes =
            eh * 60 + em;

          return (
            currentTime >=
              startMinutes &&
            currentTime <=
              endMinutes
          );

        });

      setCurrentClass(
        active || {
          subject:
            "พัก / ไม่มีคาบ",
          teacher: "",
          start: "",
          end: "",
        }
      );
    };

    updateCurrentClass();

    const interval =
      setInterval(
        updateCurrentClass,
        1000
      );

    return () =>
      clearInterval(interval);

  }, [schedule]);

  /* =========================
     ADD DATA
  ========================= */

  const addAssignment =
    async () => {

      try {

        if (
          !assignmentForm.title
        )
          return;

        await push(
          ref(db, "assignments"),
          assignmentForm
        );

        setAssignmentForm({
          title: "",
          subject: "",
          due: "",
        });

      } catch (error) {
        console.error(error);
      }
    };

  const addAnnouncement =
    async () => {

      try {

        if (!announcementForm)
          return;

        await push(
          ref(
            db,
            "announcements"
          ),
          {
            text:
              announcementForm,
          }
        );

        setAnnouncementForm("");

      } catch (error) {
        console.error(error);
      }
    };

  const addSchedule =
    async () => {

      try {

        if (
          !scheduleForm.subject
        )
          return;

        await push(
          ref(db, "schedule"),
          scheduleForm
        );

        setScheduleForm({
          day: "",
          period: "",
          subject: "",
          teacher: "",
          start: "",
          end: "",
        });

      } catch (error) {
        console.error(error);
      }
    };

  const deleteItem = (
    path,
    id
  ) => {
    remove(
      ref(db, `${path}/${id}`)
    );
  };

  return (
    <div
      className={`${bgMain} min-h-screen p-4 lg:p-8 transition-all duration-300`}
    >

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <Card
          className={`${cardStyle} rounded-3xl shadow-2xl mb-6`}
        >

          <CardContent className="p-6">

            <div className="flex flex-col lg:flex-row justify-between gap-6">

              <div>

                <h1 className="text-4xl lg:text-5xl font-black">
                  THK Engineering
                </h1>

                <div className="flex gap-3 mt-4 flex-wrap">

                  <Button
                    variant="outline"
                    className={
                      buttonStyle
                    }
                    onClick={() =>
                      setDarkMode(
                        !darkMode
                      )
                    }
                  >
                    {darkMode
                      ? "☀ Light"
                      : "🌙 Dark"}
                  </Button>

                  <Button
                    variant="outline"
                    className={
                      buttonStyle
                    }
                    onClick={() =>
                      setLanguage(
                        language ===
                          "th"
                          ? "en"
                          : "th"
                      )
                    }
                  >
                    {language ===
                    "th"
                      ? "🇹🇭 ไทย"
                      : "🇺🇸 English"}
                  </Button>

                </div>

                <p
                  className={`${subText} mt-4 text-lg`}
                >
                  {t.dashboard}
                </p>

              </div>

              <div className="text-right">

                <div className="text-5xl lg:text-6xl font-black">

                  {time.toLocaleTimeString(
                    "th-TH",
                    {
                      hour:
                        "2-digit",
                      minute:
                        "2-digit",
                    }
                  )}

                </div>

                <div
                  className={`${subText} mt-2 text-lg`}
                >
                  {time.toLocaleDateString(
                    "th-TH"
                  )}
                </div>

              </div>

            </div>

          </CardContent>

        </Card>

        {/* GRID */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* LEFT */}

          <div className="xl:col-span-2 space-y-6">

            <div className="grid md:grid-cols-2 gap-6">

              {/* CURRENT CLASS */}

              <Card className="bg-gradient-to-r from-cyan-500 to-blue-600 border-none rounded-3xl shadow-2xl text-white">

                <CardContent className="p-6">

                  <div className="flex items-center gap-3 uppercase tracking-widest text-sm opacity-80">
                    <BookOpen size={18} />
                    {t.currentClass}
                  </div>

                  <div className="mt-5 text-5xl font-black">

                    {currentClass
                      ? currentClass.subject
                      : "No Class"}

                  </div>

                  <div className="mt-3 text-xl opacity-90">

                    {currentClass
                      ? `${currentClass.teacher} ${currentClass.start} - ${currentClass.end}`
                      : "Free Time"}

                  </div>

                </CardContent>

              </Card>

              {/* STATUS */}

              <Card className="bg-gradient-to-r from-emerald-500 to-green-600 border-none rounded-3xl shadow-2xl text-white">

                <CardContent className="p-6">

                  <div className="flex items-center gap-3 uppercase tracking-widest text-sm opacity-80">
                    <Wifi size={18} />
                    {t.status}
                  </div>

                  <div className="mt-5 text-5xl font-black">
                    {t.online}
                  </div>

                  <div className="mt-3 text-lg opacity-90">
                    Firebase Connected
                  </div>

                </CardContent>

              </Card>

            </div>

            {/* ASSIGNMENTS */}

            <Card
              className={`${cardStyle} rounded-3xl shadow-2xl`}
            >

              <CardContent className="p-6">

                <div className="flex justify-between items-center mb-6">

                  <div className="flex items-center gap-3">
                    <Clock3 />
                    <h2 className="text-3xl font-bold">
                      {t.assignments}
                    </h2>
                  </div>

                  <Badge className="text-base px-4 py-2 rounded-xl">
                    {assignments.length}
                  </Badge>

                </div>

                <div className="space-y-4">

                  {assignments.map(
                    (item) => (

                      <div
                        key={item.id}
                        className={`${
                          darkMode
                            ? "bg-zinc-900"
                            : "bg-zinc-100"
                        } border ${
                          darkMode
                            ? "border-zinc-800"
                            : "border-zinc-200"
                        } rounded-2xl p-5 flex justify-between items-center`}
                      >

                        <div>

                          <div className="text-2xl font-bold">
                            {item.title}
                          </div>

                          <div className={`${subText} mt-2`}>
                            {item.subject}
                          </div>

                        </div>

                        <div className="flex gap-3 items-center">

                          <Badge className="bg-yellow-500 text-black">
                            {item.due}
                          </Badge>

                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() =>
                              deleteItem(
                                "assignments",
                                item.id
                              )
                            }
                          >
                            <Trash2 size={18} />
                          </Button>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </CardContent>

            </Card>

          </div>

          {/* RIGHT */}

          <div className="space-y-6">

            {/* ANNOUNCEMENTS */}

            <Card
              className={`${cardStyle} rounded-3xl shadow-2xl`}
            >

              <CardContent className="p-6">

                <div className="flex items-center gap-3 mb-6">
                  <Bell />
                  <h2 className="text-3xl font-bold">
                    {t.announcements}
                  </h2>
                </div>

                <div className="space-y-3">

                  {announcements.map(
                    (item) => (

                      <div
                        key={item.id}
                        className={`${
                          darkMode
                            ? "bg-zinc-900"
                            : "bg-zinc-100"
                        } border ${
                          darkMode
                            ? "border-zinc-800"
                            : "border-zinc-200"
                        } rounded-2xl p-4 flex justify-between items-center`}
                      >

                        <div>
                          {item.text}
                        </div>

                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() =>
                            deleteItem(
                              "announcements",
                              item.id
                            )
                          }
                        >
                          <Trash2 size={18} />
                        </Button>

                      </div>

                    )
                  )}

                </div>

              </CardContent>

            </Card>

            {/* SCHEDULE */}

            <Card
              className={`${cardStyle} rounded-3xl shadow-2xl`}
            >

              <CardContent className="p-6">

                <h2 className="text-3xl font-bold mb-6">
                  {t.schedule}
                </h2>

                {weekdays.map(
                  (day) => (

                    <div
                      key={day}
                      className="mb-6"
                    >

                      <h3 className="text-2xl font-bold mb-3">
                        {day}
                      </h3>

                      <div className="space-y-3">

                        {schedule
                          .filter(
                            (item) =>
                              item.day ===
                              day
                          )
                          .map(
                            (item) => (

                              <div
                                key={
                                  item.id
                                }
                                className={`${
                                  darkMode
                                    ? "bg-zinc-900"
                                    : "bg-zinc-100"
                                } border ${
                                  darkMode
                                    ? "border-zinc-800"
                                    : "border-zinc-200"
                                } rounded-2xl p-4`}
                              >

                                <div className="flex justify-between items-center">

                                  <div>

                                    <div className="font-bold text-xl">
                                      {
                                        item.subject
                                      }
                                    </div>

                                    <div className={`${subText} mt-1`}>
                                      {
                                        item.teacher
                                      }
                                    </div>

                                  </div>

                                  <div className="text-right">

                                    <Badge className="px-4 py-2 rounded-xl text-base">
                                      คาบ{" "}
                                      {
                                        item.period
                                      }
                                    </Badge>

                                    <div className={`${subText} mt-2 text-sm`}>
                                      {
                                        item.start
                                      }{" "}
                                      -{" "}
                                      {
                                        item.end
                                      }
                                    </div>

                                  </div>

                                </div>

                              </div>

                            )
                          )}

                        {schedule.filter(
                          (item) =>
                            item.day ===
                            day
                        ).length ===
                          0 && (

                          <div
                            className={`${
                              darkMode
                                ? "bg-zinc-900"
                                : "bg-zinc-100"
                            } rounded-2xl p-4 ${subText}`}
                          >
                            ไม่มีคาบเรียน
                          </div>

                        )}

                      </div>

                    </div>

                  )
                )}

              </CardContent>

            </Card>

          </div>

        </div>

        {/* CONTROL PANEL */}

        <Card
          className={`${cardStyle} rounded-3xl shadow-2xl mt-6`}
        >

          <CardContent className="p-6">

            <Tabs defaultValue="assignments">

              <TabsList className="grid grid-cols-3 mb-6">

                <TabsTrigger value="assignments">
                  {t.assignments}
                </TabsTrigger>

                <TabsTrigger value="announcements">
                  {t.announcements}
                </TabsTrigger>

                <TabsTrigger value="schedule">
                  {t.schedule}
                </TabsTrigger>

              </TabsList>

              {/* ASSIGNMENTS */}

              <TabsContent value="assignments">

                <div className="grid md:grid-cols-4 gap-4">

                  <Input
                    placeholder={
                      t.assignment
                    }
                    className={
                      inputStyle
                    }
                    value={
                      assignmentForm.title
                    }
                    onChange={(e) =>
                      setAssignmentForm(
                        {
                          ...assignmentForm,
                          title:
                            e
                              .target
                              .value,
                        }
                      )
                    }
                  />

                  <Input
                    placeholder={
                      t.subject
                    }
                    className={
                      inputStyle
                    }
                    value={
                      assignmentForm.subject
                    }
                    onChange={(e) =>
                      setAssignmentForm(
                        {
                          ...assignmentForm,
                          subject:
                            e
                              .target
                              .value,
                        }
                      )
                    }
                  />

                  <Input
                    placeholder={t.due}
                    className={
                      inputStyle
                    }
                    value={
                      assignmentForm.due
                    }
                    onChange={(e) =>
                      setAssignmentForm(
                        {
                          ...assignmentForm,
                          due:
                            e
                              .target
                              .value,
                        }
                      )
                    }
                  />

                  <Button
                    onClick={
                      addAssignment
                    }
                  >
                    <Plus className="mr-2" />
                    {t.add}
                  </Button>

                </div>

              </TabsContent>

              {/* ANNOUNCEMENTS */}

              <TabsContent value="announcements">

                <div className="flex flex-col md:flex-row gap-4">

                  <Textarea
                    placeholder={
                      t.announcementPlaceholder
                    }
                    className={
                      inputStyle
                    }
                    value={
                      announcementForm
                    }
                    onChange={(e) =>
                      setAnnouncementForm(
                        e.target
                          .value
                      )
                    }
                  />

                  <Button
                    onClick={
                      addAnnouncement
                    }
                  >
                    <Plus className="mr-2" />
                    {t.add}
                  </Button>

                </div>

              </TabsContent>

              {/* SCHEDULE */}

              <TabsContent value="schedule">

                <div className="grid md:grid-cols-6 gap-4">

                  <select
                    className={`${inputStyle} h-10 rounded-md px-3`}
                    value={
                      scheduleForm.day
                    }
                    onChange={(e) =>
                      setScheduleForm(
                        {
                          ...scheduleForm,
                          day:
                            e.target
                              .value,
                        }
                      )
                    }
                  >

                    <option value="">
                      เลือกวัน
                    </option>

                    {weekdays.map(
                      (day) => (
                        <option
                          key={day}
                          value={day}
                        >
                          {day}
                        </option>
                      )
                    )}

                  </select>

                  <Input
                    placeholder={
                      t.period
                    }
                    className={
                      inputStyle
                    }
                    value={
                      scheduleForm.period
                    }
                    onChange={(e) =>
                      setScheduleForm(
                        {
                          ...scheduleForm,
                          period:
                            e
                              .target
                              .value,
                        }
                      )
                    }
                  />

                  <Input
                    placeholder={
                      t.subject
                    }
                    className={
                      inputStyle
                    }
                    value={
                      scheduleForm.subject
                    }
                    onChange={(e) =>
                      setScheduleForm(
                        {
                          ...scheduleForm,
                          subject:
                            e
                              .target
                              .value,
                        }
                      )
                    }
                  />

                  <Input
                    placeholder={
                      t.teacher
                    }
                    className={
                      inputStyle
                    }
                    value={
                      scheduleForm.teacher
                    }
                    onChange={(e) =>
                      setScheduleForm(
                        {
                          ...scheduleForm,
                          teacher:
                            e
                              .target
                              .value,
                        }
                      )
                    }
                  />

                  <Input
                    placeholder="08:00"
                    className={
                      inputStyle
                    }
                    value={
                      scheduleForm.start
                    }
                    onChange={(e) =>
                      setScheduleForm(
                        {
                          ...scheduleForm,
                          start:
                            e
                              .target
                              .value,
                        }
                      )
                    }
                  />

                  <Input
                    placeholder="09:00"
                    className={
                      inputStyle
                    }
                    value={
                      scheduleForm.end
                    }
                    onChange={(e) =>
                      setScheduleForm(
                        {
                          ...scheduleForm,
                          end:
                            e
                              .target
                              .value,
                        }
                      )
                    }
                  />

                </div>

                <Button
                  className="mt-4"
                  onClick={
                    addSchedule
                  }
                >
                  <Plus className="mr-2" />
                  {t.add}
                </Button>

              </TabsContent>

            </Tabs>

          </CardContent>

        </Card>

      </div>

    </div>
  );
}