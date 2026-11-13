// Bengali (বাংলা) section. The root <html lang> stays "en-BD" (single root
// layout), so the language of this subtree is declared on the wrapper.
export default function BnLayout({ children }: { children: React.ReactNode }) {
  return <div lang="bn-BD">{children}</div>;
}
