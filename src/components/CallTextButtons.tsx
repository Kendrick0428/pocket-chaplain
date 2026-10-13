import { smsHref, telHref } from "@/lib/phone";
import { PhoneIcon, TextIcon } from "./Icons";

/** Links that open the phone's own call or messages screen. Nothing is dialed or sent automatically. */
export function CallTextButtons({ name, phone, textPhone }: { name: string; phone?: string; textPhone?: string }) {
  const sms = textPhone || phone;
  return (
    <div className="btn-row two">
      {phone && (
        <a className="btn" href={telHref(phone)}>
          <PhoneIcon /> Call<span className="sr-only"> {name}</span>
        </a>
      )}
      {sms && (
        <a className="btn gold" href={smsHref(sms)}>
          <TextIcon /> Text<span className="sr-only"> {name}</span>
        </a>
      )}
    </div>
  );
}
