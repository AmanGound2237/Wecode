type TagPillProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export default function TagPill({ label, active, onClick }: TagPillProps) {
  const className = `tag-pill ${
    active
      ? "bg-green-500/20 text-green-400 border-green-500"
      : "text-gray-500 hover:text-green-400 hover:border-green-600"
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
