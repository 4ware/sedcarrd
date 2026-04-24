type Props = {
  children: React.ReactNode;
};

function LoginLayout({ children }: Props) {
  return (
    <section className="h-screen w-screen flex flex-row">
      <div className="w-1/2 h-screen bg-amber-200">r</div>
      <div className="h-screen w-1/2 flex items-center justify-center bg-muted">
        {children}
      </div>
    </section>
  );
}

export default LoginLayout;
