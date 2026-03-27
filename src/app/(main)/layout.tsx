export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="film-grain">
      {children}
    </div>
  );
}
