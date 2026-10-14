import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/lib/auth";
import { Droplets, Phone, ShieldCheck, Car, Sparkles, MapPin, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";

export default function WelcomePage() {
  const { login, verifyOtp } = useAuth();
  const [step, setStep] = useState<"welcome" | "phone" | "otp">("welcome");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 9) {
      setError("يرجى إدخال رقم جوال صحيح");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(phone.startsWith("05") ? phone : `05${phone}`);
      setStep("otp");
    } catch {
      setError("فشل في إرسال رمز التحقق");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      setError("يرجى إدخال رمز التحقق كاملاً");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const fullPhone = phone.startsWith("05") ? phone : `05${phone}`;
      await verifyOtp(fullPhone, otp);
    } catch {
      setError("رمز التحقق غير صحيح");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-mesh flex flex-col relative overflow-hidden">
      <div className="absolute top-4 left-4 z-50">
        <ThemeToggle />
      </div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <AnimatePresence mode="wait">
        {step === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.35 }}
            className="flex-1 flex flex-col items-center justify-center p-6 relative z-10"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mb-6 shadow-xl"
            >
              <img src="/images/logo.svg" alt="WashFlow" className="w-12 h-12 brightness-0 invert" />
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold mb-2 text-gradient"
            >
              WashFlow
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground text-center mb-10 max-w-xs"
            >
              خدمات العناية وغسيل السيارات المتنقلة عند باب بيتك
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-3 mb-10"
            >
              <FeatureChip icon={<Car className="w-4 h-4" />} label="نغسل في مكانك" />
              <FeatureChip icon={<Sparkles className="w-4 h-4" />} label="جودة عالية" />
              <FeatureChip icon={<MapPin className="w-4 h-4" />} label="شمال الرياض" />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full max-w-xs"
            >
              <Button
                size="lg"
                className="w-full text-base rounded-[0.75rem] gap-2"
                onClick={() => setStep("phone")}
                data-testid="button-start"
              >
                ابدأ الآن
                <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-center text-muted-foreground text-xs mt-3">
                سجّل برقم جوالك واحجز خدمتك خلال دقائق
              </p>
            </motion.div>
          </motion.div>
        )}

        {step === "phone" && (
          <motion.div
            key="phone"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.35 }}
            className="flex-1 flex items-center justify-center p-6 relative z-10"
          >
            <div className="glass rounded-[1.25rem] border border-white/20 dark:border-white/10 p-6 w-full max-w-md shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-[0.75rem] bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-md">
                  <img src="/images/logo.svg" alt="WashFlow" className="w-6 h-6 brightness-0 invert" />
                </div>
                <div>
                  <h2 className="text-xl font-bold" data-testid="text-login-title">تسجيل الدخول</h2>
                  <p className="text-muted-foreground text-sm">أدخل رقم جوالك السعودي</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2 items-center" dir="ltr">
                  <span className="text-muted-foreground font-medium glass-subtle px-3 min-h-9 flex items-center rounded-[0.5rem] text-sm border border-white/10">+966</span>
                  <Input
                    type="tel"
                    placeholder="05XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="text-left rounded-[0.5rem]"
                    dir="ltr"
                    data-testid="input-phone"
                  />
                </div>
                {error && <p className="text-destructive text-sm" data-testid="text-error">{error}</p>}
                <Button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full rounded-[0.75rem]"
                  data-testid="button-send-otp"
                >
                  {loading ? "جاري الإرسال..." : "إرسال رمز التحقق"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setStep("welcome")}
                  className="w-full"
                  data-testid="button-back-welcome"
                >
                  رجوع
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {step === "otp" && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.35 }}
            className="flex-1 flex items-center justify-center p-6 relative z-10"
          >
            <div className="glass rounded-[1.25rem] border border-white/20 dark:border-white/10 p-6 w-full max-w-md shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-[0.75rem] bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-md">
                  <img src="/images/logo.svg" alt="WashFlow" className="w-6 h-6 brightness-0 invert" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">التحقق</h2>
                  <p className="text-muted-foreground text-sm">
                    أدخل رمز التحقق المرسل إلى {phone}
                  </p>
                </div>
              </div>

              <div className="space-y-4 flex flex-col items-center">
                <div dir="ltr">
                  <InputOTP
                    maxLength={4}
                    value={otp}
                    onChange={setOtp}
                    data-testid="input-otp"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-xs text-muted-foreground">للتجربة: الرمز هو 1234</p>
                {error && <p className="text-destructive text-sm" data-testid="text-error">{error}</p>}
                <Button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full rounded-[0.75rem]"
                  data-testid="button-verify-otp"
                >
                  {loading ? "جاري التحقق..." : "تأكيد"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
                  className="w-full"
                  data-testid="button-back-phone"
                >
                  تغيير الرقم
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FeatureChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="glass-subtle rounded-full px-4 py-2 flex items-center gap-2 border border-white/15 dark:border-white/10">
      <span className="text-primary">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
