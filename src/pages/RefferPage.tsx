import { GradientHeader } from '../components/ui/GradientHeader';
import { InfoRow } from '../components/ui/InfoRow';
import { BackBottomBar } from '../components/ui/BackBottomBar';
import blurImage from '../assets/img/reffer-header-blur-img.png';
import noBlurImage from '../assets/img/reffer-header-img.png';

export function RefferPage() {
  return (
    <>
      <div className="flex relative flex-col p-4 gap-4 w-full h-full mb-18">
        <GradientHeader isCustomBg={true} className="items-end justify-between gap-2.5">
          <img src={blurImage} className="absolute top-0 right-[40px]" alt="" />
          <img src={noBlurImage} className="absolute bottom-0 h-full right-[80px]" alt="" />
          <span className="text-white font-semibold text-2xl leading-[120%] tracking-[-0.02em] z-10">
            Реферальная<br />система
          </span>
          <div className="flex py-3 px-4 h-max rounded-lg bg-black/24 backdrop-blur-[7px] items-center z-10">
            <span className="text-white font-medium text-xs leading-[140%] tracking-[-0.02em] whitespace-nowrap">
              ID: 2831234
            </span>
          </div>
        </GradientHeader>

        <div className="flex flex-col gap-1.5 w-full">
          <span className="text-white font-medium text-xl leading-[160%] tracking-[-0.02em]">
            Ссылка для приглашения
          </span>
          <InfoRow
            label="http://t.me/MiraCardsBot?start=REF7261326004"
            value=""
            copyValue="http://t.me/MiraCardsBot?start=REF7261326004"
          />
        </div>

        <div className="flex flex-col gap-3 w-full">
          <span className="text-white font-medium text-xl leading-[160%] tracking-[-0.02em]">
            Статистика
          </span>
          <div className="flex flex-col gap-1.5 w-full">
            <InfoRow label="Приглашено пользователей" value="512" />
          </div>
        </div>
      </div>

      <BackBottomBar />
    </>
  );
}
