import type { CompanySettings, DocData } from "@/lib/types";
import { TYPE_LABEL } from "@/lib/types";
import { brl, dateBR } from "@/lib/format";

interface Props {
  doc: DocData;
  company: CompanySettings;
}

/** Página A4 renderizada — usada no preview em tempo real e na impressão/PDF. */
export function A4Preview({ doc, company }: Props) {
  const value =
    doc.billing === "pontual" ? doc.totalValue : doc.monthlyValue;

  return (
    <div className="print-area mx-auto w-full max-w-[794px] bg-white px-12 py-12 text-[13px] leading-relaxed text-slate-800">
      {/* Cabeçalho da empresa */}
      <header className="flex items-start justify-between border-b-2 border-slate-800 pb-5">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-slate-900">
            {company.name}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {company.document} · {company.email}
            <br />
            {company.phone} · {company.address} — {company.city}
          </p>
        </div>
        <div className="text-right">
          <span className="inline-block rounded bg-slate-800 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
            {TYPE_LABEL[doc.type]}
          </span>
          <p className="mt-2 text-xs text-slate-500">
            Emitido em {dateBR(doc.createdAt)}
          </p>
        </div>
      </header>

      {/* Título e cliente */}
      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-slate-900">
          {doc.title || "Documento sem título"}
        </h2>
        <p className="mt-2 text-sm">
          <span className="font-semibold">Cliente:</span>{" "}
          {doc.clientName || "—"}
        </p>
      </section>

      {/* Condições comerciais */}
      <section className="mt-8">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
          Condições comerciais
        </h3>
        <table className="w-full border-collapse text-sm">
          <tbody>
            {doc.billing === "pontual" ? (
              <>
                <tr className="border-b border-slate-200">
                  <td className="py-2.5 font-medium text-slate-600">Valor total do projeto</td>
                  <td className="py-2.5 text-right font-semibold text-slate-900">{brl(doc.totalValue)}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2.5 font-medium text-slate-600">Prazo de entrega final</td>
                  <td className="py-2.5 text-right text-slate-900">{dateBR(doc.deadline)}</td>
                </tr>
                {doc.milestones.map((m) => (
                  <tr key={m.id} className="border-b border-slate-200">
                    <td className="py-2.5 pl-4 text-slate-600">· {m.label}</td>
                    <td className="py-2.5 text-right text-slate-900">
                      {m.percent}% — {brl((doc.totalValue * m.percent) / 100)}
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <>
                <tr className="border-b border-slate-200">
                  <td className="py-2.5 font-medium text-slate-600">Valor mensal</td>
                  <td className="py-2.5 text-right font-semibold text-slate-900">{brl(doc.monthlyValue)}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2.5 font-medium text-slate-600">Dia de vencimento</td>
                  <td className="py-2.5 text-right text-slate-900">Todo dia {doc.dueDay}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2.5 font-medium text-slate-600">Vigência mínima</td>
                  <td className="py-2.5 text-right text-slate-900">{doc.minTermMonths} meses</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2.5 font-medium text-slate-600">Aviso prévio de cancelamento</td>
                  <td className="py-2.5 text-right text-slate-900">{doc.noticeDays} dias</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2.5 font-medium text-slate-600">Reajuste anual</td>
                  <td className="py-2.5 text-right text-slate-900">{doc.adjustmentIndex}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </section>

      {/* Escopo */}
      <section className="mt-8">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
          Escopo e entregáveis
        </h3>
        <ul className="space-y-2.5">
          {doc.scope
            .filter((s) => s.title.trim())
            .map((s) => (
              <li key={s.id} className="flex gap-2.5">
                <span className={`mt-0.5 font-bold ${s.included ? "text-emerald-700" : "text-slate-400"}`}>
                  {s.included ? "✓" : "—"}
                </span>
                <div>
                  <span className={`font-semibold ${s.included ? "text-slate-900" : "text-slate-500 line-through"}`}>
                    {s.title}
                  </span>
                  {s.description && (
                    <p className="text-slate-600">{s.description}</p>
                  )}
                </div>
              </li>
            ))}
        </ul>
      </section>

      {/* Cláusulas padronizadas */}
      <section className="mt-8">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
          Cláusulas gerais
        </h3>
        <div className="space-y-3 text-justify text-[12px] text-slate-600">
          <p>
            <strong className="text-slate-800">1. Propriedade intelectual.</strong>{" "}
            Todos os direitos sobre os materiais, códigos, textos e entregáveis
            produzidos no âmbito deste {doc.type === "proposta" ? "projeto" : "contrato"}{" "}
            serão transferidos ao CLIENTE somente após a quitação integral dos
            valores devidos.
          </p>
          <p>
            <strong className="text-slate-800">2. Confidencialidade.</strong>{" "}
            As partes comprometem-se a manter sigilo sobre todas as informações
            comerciais, técnicas e estratégicas trocadas durante a vigência
            deste instrumento, pelo prazo de 24 (vinte e quatro) meses após seu
            encerramento.
          </p>
          <p>
            <strong className="text-slate-800">3. Foro.</strong>{" "}
            Fica eleito o foro da comarca de {company.city} para dirimir
            quaisquer controvérsias oriundas deste instrumento, com renúncia
            expressa a qualquer outro, por mais privilegiado que seja.
          </p>
        </div>
      </section>

      {/* Assinaturas */}
      <section className="mt-14 grid grid-cols-2 gap-10">
        <div className="text-center">
          <div className="border-t border-slate-400 pt-2 text-xs text-slate-600">
            {company.name}
            <br />
            Contratada
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-slate-400 pt-2 text-xs text-slate-600">
            {doc.clientName || "Cliente"}
            <br />
            Contratante
          </div>
        </div>
      </section>

      <footer className="mt-10 border-t border-slate-200 pt-3 text-center text-[10px] text-slate-400">
        {company.name} · {TYPE_LABEL[doc.type]} · Valor{" "}
        {doc.billing === "pontual" ? "total" : "mensal"}: {brl(value)}
      </footer>
    </div>
  );
}
