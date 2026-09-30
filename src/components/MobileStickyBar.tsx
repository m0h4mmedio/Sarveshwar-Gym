import React from 'react';
import { Phone, MessageSquare, MapPin } from 'lucide-react';
import { getWhatsAppUrl } from '../utils/whatsapp';

interface MobileStickyBarProps {
  phone: string;
  phoneRaw: string;
  whatsapp: string;
  googleMapsUrl: string;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({
  phoneRaw,
  whatsapp,
  googleMapsUrl,
}) => {
  const waUrl = getWhatsAppUrl(
    whatsapp,
    "Hi Sarveshwar Fitness, I would like to enquire about gym memberships."
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#070908]/96 backdrop-blur-md border-t border-[#263329] px-3 py-2.5 shadow-2xl">
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        <a
          href={`tel:${phoneRaw}`}
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#121814] hover:bg-[#1a231d] text-[#f2f3ee] text-xs font-semibold tracking-wider border border-[#263329] transition-colors rounded-none"
        >
          <Phone className="w-3.5 h-3.5 text-[#c5a869]" />
          <span>Call</span>
        </a>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#25d366] hover:bg-[#20ba5a] text-[#070908] text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#25d366]/20 rounded-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#070908] animate-pulse" />
          <MessageSquare className="w-3.5 h-3.5 fill-current" />
          <span>WhatsApp</span>
        </a>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#121814] hover:bg-[#1a231d] text-[#f2f3ee] text-xs font-semibold tracking-wider border border-[#263329] transition-colors rounded-none"
        >
          <MapPin className="w-3.5 h-3.5 text-[#c5a869]" />
          <span>Directions</span>
        </a>
      </div>
    </div>
  );
};
