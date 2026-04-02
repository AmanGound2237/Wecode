type TagPillProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export default function TagPill({ label, active, onClick }: TagPillProps) {
  const className = `tag-pill ${
    active
      ? "bg-[#2a9d8f] text-white border-transparent"
      : "bg-white/70 text-[#4b3f35]"
  }`;

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {label}
      </button>
    );
  }

  return <span className={className}>{label}</span>;
}
