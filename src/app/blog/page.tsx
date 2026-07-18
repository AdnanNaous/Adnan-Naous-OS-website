"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MessageSquare, Heart, Repeat2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Blog() {
  const { t, language } = useLanguage();

  const tweets = [
    {
      content: language === "ar" ? "أنهيت للتو بناء نموذج جودو الأولي! التدفق المنطقي للعبة بدأ يبدو طبيعياً. الانتقال من الدراسات الطبية إلى البرمجة كان رحلة جامحة ولكن مجزية. 🎮💻" : "Just finished building the Godot prototype! Game logic flow is starting to feel natural. Transitioning from medical studies to code has been a wild but rewarding ride. 🎮💻",
      date: language === "ar" ? "قبل ساعتين" : "2 hours ago",
      stats: { replies: 2, retweets: 5, likes: 24 }
    },
    {
      content: language === "ar" ? "هناك شيء مُرضي للغاية في إعداد بيئة Vercel Next.js جديدة. صفحة بيضاء، وضع مظلم، بدون إضافات زائدة. لنبدأ البناء." : "There is something incredibly satisfying about setting up a fresh Vercel Next.js environment. Clean slate, dark mode, zero bloat. Let's build.",
      date: language === "ar" ? "أمس" : "Yesterday",
      stats: { replies: 8, retweets: 12, likes: 104 }
    },
    {
      content: language === "ar" ? "يوميات الأنمي وبعض تدريبات الرسم الرقمي لتصفية الذهن بعد الخوارزميات. الانضباط يصنع الحرية." : "Anime dailies and some digital art practice to clear the mind after algorithms. Discipline creates freedom.",
      date: language === "ar" ? "قبل 3 أيام" : "3 days ago",
      stats: { replies: 1, retweets: 0, likes: 15 }
    }
  ];

  return (
    <main className="max-w-2xl mx-auto px-4 py-20 min-h-screen" dir={language === "ar" ? "rtl" : "ltr"}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">{t("blogTitle")}</h1>
        
        <div className="flex flex-col border-t border-[var(--border)]">
          {tweets.map((tweet, idx) => (
            <motion.div 
              whileHover={{ backgroundColor: "rgba(128,128,128,0.05)" }}
              key={idx} 
              className="p-6 border-b border-[var(--border)] transition-colors"
            >
              <div className="flex gap-4">
                <div className="relative w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-800 shrink-0 overflow-hidden">
                  <Image src="/profile.jpg" alt="" aria-hidden="true" fill sizes="3rem" className="object-cover grayscale contrast-125" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">Adnan Naous</span>
                    <span className="text-neutral-500 text-sm" dir="ltr">@aantrueman</span>
                    <span className="text-neutral-500 text-sm">· {tweet.date}</span>
                  </div>
                  <p className="text-[var(--foreground)] mb-4 leading-relaxed">{tweet.content}</p>
                  
                  <div className="flex gap-8 text-neutral-500" dir="ltr">
                    <span className="flex items-center gap-2 text-sm" aria-label={`${tweet.stats.replies} ${language === "ar" ? "ردود" : "replies"}`}>
                      <MessageSquare size={16} aria-hidden="true" /> {tweet.stats.replies}
                    </span>
                    <span className="flex items-center gap-2 text-sm" aria-label={`${tweet.stats.retweets} ${language === "ar" ? "إعادات نشر" : "reposts"}`}>
                      <Repeat2 size={16} aria-hidden="true" /> {tweet.stats.retweets}
                    </span>
                    <span className="flex items-center gap-2 text-sm" aria-label={`${tweet.stats.likes} ${language === "ar" ? "إعجابات" : "likes"}`}>
                      <Heart size={16} aria-hidden="true" /> {tweet.stats.likes}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
