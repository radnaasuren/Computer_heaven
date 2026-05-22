"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type SurveyAnswers = {
  useCase: string;
  budget: string;
  priority: string;
  resolution: string;
};

const STEPS = [
  {
    id: "useCase",
    title: "Та энэ компьютерийг гол төлөв юунд ашиглах вэ?",
    options: [
      { value: "gaming", label: "Тоглоом", hint: "Өндөр FPS, орчин үеийн тоглоомууд" },
      { value: "office", label: "Оффис, сургалт", hint: "Интернет, баримт, видео дуудлага" },
      { value: "streaming", label: "Стрим", hint: "Тоглоом + бичлэг хийх" },
      { value: "workstation", label: "Ажлын станц", hint: "Засвар, 3D, хүнд ачаалал" },
    ],
  },
  {
    id: "budget",
    title: "Таны төсөв хэмжээ?",
    options: [
      { value: "budget", label: "$1,000-с доош", hint: "Эхлэгч түвшний угсралт" },
      { value: "mid", label: "$1,000 – $1,800", hint: "Тэнцвэрт гүйцэтгэл" },
      { value: "high", label: "$1,800 – $2,500", hint: "Хүчирхэг GPU, CPU" },
      { value: "premium", label: "$2,500+", hint: "Дээд зэргийн эд анги" },
    ],
  },
  {
    id: "priority",
    title: "Танд хамгийн чухал юу вэ?",
    options: [
      { value: "fps", label: "Хамгийн өндөр FPS", hint: "Тоглоомд GPU-д анхаарна" },
      { value: "balanced", label: "Тэнцвэрт угсралт", hint: "Бүх талдаа сайн үнэ цэнэ" },
      { value: "quiet", label: "Чимээгүй, хүйтэн", hint: "Сайн хөргөлт, блок питк" },
      { value: "future", label: "Ирээдүйд өргөтгөх", hint: "Дараа нь сайжруулах боломжтой" },
    ],
  },
  {
    id: "resolution",
    title: "Та ямар дэлгэцийн нягтаршилд зорьж байна вэ?",
    options: [
      { value: "1080p", label: "1080p", hint: "Full HD — хамгийн түгээмэл" },
      { value: "1440p", label: "1440p", hint: "Тод зураг, дунд-өндөр GPU" },
      { value: "4k", label: "4K", hint: "Өндөр шаардлага — дээд GPU" },
      { value: "unsure", label: "Одоохондоо мэдэхгүй", hint: "Бид тэнцвэрт сонголт санал болгоно" },
    ],
  },
] as const;

const initialAnswers: SurveyAnswers = {
  useCase: "",
  budget: "",
  priority: "",
  resolution: "",
};

function buildPrebuiltCategory(answers: SurveyAnswers): string {
  if (answers.useCase === "gaming" || answers.useCase === "streaming") return "Gaming";
  if (answers.useCase === "workstation") return "Workstation";
  if (answers.useCase === "office") return "Office";
  if (answers.budget === "budget") return "Budget";
  return "Бүгд";
}

export function SurveyClient() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>(initialAnswers);
  const [done, setDone] = useState(false);

  const current = STEPS[step];
  const currentKey = current.id as keyof SurveyAnswers;
  const selected = answers[currentKey];
  const progress = ((step + (done ? 1 : 0)) / STEPS.length) * 100;

  const setAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentKey]: value }));
  };

  const goNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    setDone(true);
  };

  const goBack = () => {
    if (done) {
      setDone(false);
      return;
    }
    if (step > 0) setStep((s) => s - 1);
  };

  const viewRecommendations = () => {
    const category = buildPrebuiltCategory(answers);
    const params = new URLSearchParams({
      from: "survey",
      useCase: answers.useCase,
      budget: answers.budget,
      priority: answers.priority,
      resolution: answers.resolution,
    });
    if (category !== "Бүгд") params.set("category", category);
    router.push(`/prebuilt?${params.toString()}`);
  };

  const startManualBuild = () => {
    router.push("/build");
  };

  if (done) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-green-50">
            <Check className="size-7 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">Бэлэн боллоо</h1>
          <p className="text-gray-500 mb-8">
            Таны хариултад үндэслэн бид тохирох бэлэн компьютерүүдийг харуулах эсвэл
            угсралтын хэсгүүдийг нарийвчлан сонгож болно.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl"
              onClick={viewRecommendations}
            >
              Зөвлөмжит угсралтууд харах
            </Button>
            <Button
              variant="outline"
              className="px-8 py-6 rounded-xl border-gray-300"
              onClick={startManualBuild}
            >
              PC угсралт нээх
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600 mb-2">Ухаалаг судалгаа</p>
        <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">Өөрт тохирох компьютер олоорой</h1>
        <p className="text-gray-500">
          Хэдэн асуултад хариулна уу — бид зөв угсралтыг заана.
        </p>
      </div>

      <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Card className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
        <p className="text-sm text-gray-400 mb-1">
          Алхам {step + 1} / {STEPS.length}
        </p>
        <h2 className="text-xl font-semibold text-[#1a1a2e] mb-6">{current.title}</h2>

        <RadioGroup value={selected} onValueChange={setAnswer} className="space-y-3">
          {current.options.map((opt) => (
            <Label
              key={opt.value}
              htmlFor={`${current.id}-${opt.value}`}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                selected === opt.value
                  ? "border-blue-500 bg-blue-50/50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
              }`}
            >
              <RadioGroupItem
                value={opt.value}
                id={`${current.id}-${opt.value}`}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-[#1a1a2e]">{opt.label}</div>
                <div className="text-sm text-gray-400">{opt.hint}</div>
              </div>
            </Label>
          ))}
        </RadioGroup>

        <div className="mt-8 flex justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border-gray-300"
            onClick={goBack}
            disabled={step === 0}
          >
            <ArrowLeft className="size-4 mr-2" />
            Буцах
          </Button>
          <Button
            type="button"
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
            onClick={goNext}
            disabled={!selected}
          >
            {step === STEPS.length - 1 ? "Дуусгах" : "Дараах"}
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
