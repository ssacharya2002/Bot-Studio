interface FooterSectionProps {
    title: string;
    children: React.ReactNode;
  }
  
  export default function FooterSection({ title, children }: FooterSectionProps) {
    return (
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gradient">{title}</h4>
        <div className="space-y-3 text-sm  flex flex-col">
          {children}
        </div>
      </div>
    );
  }