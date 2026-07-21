"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleAvatar } from "@/components/shared/role-avatar";
import { TESTIMONIALS } from "@/lib/data/marketing";

export function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const testimonial = TESTIMONIALS[index];

  const go = (delta: number) => {
    setIndex((prev) => (prev + delta + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Loved by candidates</h2>
      </div>

      <div className="relative mt-12 overflow-hidden rounded-2xl border border-border bg-card p-8 sm:p-10">
        <Quote className="size-8 text-primary/30" />
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            <p className="mt-4 text-lg text-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
            <div className="mt-6 flex items-center gap-3">
              <RoleAvatar name={testimonial.name} size="size-10" />
              <div>
                <p className="text-sm font-medium text-foreground">{testimonial.name}</p>
                <p className="text-xs text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-center gap-2">
          <Button variant="outline" size="icon" onClick={() => go(-1)} aria-label="Previous testimonial">
            <ChevronLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.name}
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`size-1.5 rounded-full transition-colors ${i === index ? "bg-primary" : "bg-border"}`}
              />
            ))}
          </div>
          <Button variant="outline" size="icon" onClick={() => go(1)} aria-label="Next testimonial">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
