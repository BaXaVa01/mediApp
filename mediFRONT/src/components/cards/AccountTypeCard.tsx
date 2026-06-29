import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AccountTypeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
}

export const AccountTypeCard: React.FC<AccountTypeCardProps> = ({ title, description, icon, to }) => {
  return (
    <Link to={to} className="block h-full outline-none">
      <motion.div 
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        className="flex flex-col items-center justify-center p-8 bg-white border border-[#1C365C]/5 rounded-[2rem] hover:border-[#5A9BD4]/30 shadow-[0_10px_30px_rgba(28,54,92,0.03)] hover:shadow-[0_20px_40px_rgba(28,54,92,0.08)] transition-colors cursor-pointer h-full group"
      >
        <div className="mb-6 w-20 h-20 bg-[#FDF9F3] rounded-[1.5rem] flex items-center justify-center text-[#5A9BD4] group-hover:bg-[#5A9BD4]/10 transition-colors">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-[#1C365C] mb-3 tracking-tight">{title}</h3>
        <p className="text-sm text-center text-[#1C365C]/60 font-medium leading-relaxed">{description}</p>
      </motion.div>
    </Link>
  );
};
