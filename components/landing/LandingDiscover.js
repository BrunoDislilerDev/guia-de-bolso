"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionReveal from "@/components/landing/SectionReveal";
import LandingPlaceCard from "@/components/landing/LandingPlaceCard";
import {
  defaultViewport,
  fadeUp,
  scaleIn,
  staggerContainer,
} from "@/components/landing/landingMotion";
import { LANDING_SECTION_IDS } from "@/lib/landingContent";

/**
 * Lugares reais + categorias do banco.
 * @param {object} props
 * @param {import('@/lib/landingPageData').LandingLugarCard[]} props.showcase
 * @param {import('@/lib/landingPageData').LandingPageData['categorias']} props.categorias
 * @param {import('@/lib/landingPageData').LandingPageData['rotas']} props.rotas
 * @param {boolean} props.hasLiveData
 * @returns {import('react').ReactElement}
 */
export default function LandingDiscover({ showcase, categorias, rotas, hasLiveData }) {
  return (
    <SectionReveal
      id={LANDING_SECTION_IDS.usuarios}
      className="relative overflow-hidden bg-[#f0f4f3] py-20 sm:py-28"
    >
      <div
        className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#7fd4ae]/20 blur-3xl"
        aria-hidden
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeUp}
          className="max-w-2xl"
        >
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1a4a3a]">
            Curadoria local
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#1a2e28] sm:text-4xl">
            Lugares reais da região
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#5a6b66]">
            {hasLiveData
              ? "Dados atualizados do nosso guia — praias, restaurantes, trilhas e serviços entre Garopaba e Imbituba."
              : "Em breve você verá aqui os destaques cadastrados no guia."}
          </p>
        </motion.div>

        {showcase.length > 0 ? (
          <motion.div
            className="mt-12 flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={staggerContainer}
            role="list"
            aria-label="Lugares em destaque"
          >
            {showcase.map((lugar, i) => (
              <div key={lugar.id} className="w-[min(85vw,300px)] shrink-0 snap-center" role="listitem">
                <LandingPlaceCard lugar={lugar} index={i} priority={i < 2} />
              </div>
            ))}
          </motion.div>
        ) : null}

        {categorias.length > 0 && (
          <div className="mt-16">
            <motion.h3
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              variants={fadeUp}
              className="font-display text-xl font-bold text-[#1a2e28] sm:text-2xl"
            >
              Explore por categoria
            </motion.h3>
            <motion.ul
              className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
              role="list"
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              variants={staggerContainer}
            >
              {categorias.map((cat) => (
                <motion.li
                  key={cat.nome}
                  variants={scaleIn}
                  className="group relative overflow-hidden rounded-2xl ring-1 ring-[#1a4a3a]/10"
                >
                  <div className={`relative min-h-[140px] bg-gradient-to-br ${cat.gradient} p-4`}>
                    {cat.capa && (
                      <Image
                        src={cat.capa}
                        alt=""
                        fill
                        className="object-cover opacity-40 transition-opacity group-hover:opacity-55"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    )}
                    <div className="relative z-10 flex h-full min-h-[120px] flex-col justify-end">
                      <span className="text-2xl" aria-hidden>
                        {cat.icone}
                      </span>
                      <p className="mt-2 font-display text-lg font-bold text-[#1a2e28]">
                        {cat.nome}
                      </p>
                      <p className="text-xs text-[#1a2e28]/80">{cat.descricaoCurta}</p>
                      {cat.count > 0 && (
                        <p className="mt-2 text-sm font-semibold text-[#1a4a3a]">
                          {cat.count} {cat.count === 1 ? "lugar" : "lugares"}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        )}

        {rotas.length > 0 && (
          <div className="mt-16">
            <motion.h3
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              variants={fadeUp}
              className="font-display text-xl font-bold text-[#1a2e28]"
            >
              Rotas e trilhas
            </motion.h3>
            <motion.ul
              className="mt-6 grid gap-4 sm:grid-cols-2"
              role="list"
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              variants={staggerContainer}
            >
              {rotas.map((rota) => (
                <motion.li
                  key={rota.id}
                  variants={fadeUp}
                  className="flex gap-4 overflow-hidden rounded-2xl bg-white p-3 ring-1 ring-[#1a4a3a]/10"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#d4ede8]">
                    {rota.capa ? (
                      <Image src={rota.capa} alt="" fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-2xl">🥾</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 py-1">
                    <p className="font-display font-bold text-[#1a2e28]">{rota.titulo}</p>
                    {rota.descricao && (
                      <p className="mt-1 line-clamp-2 text-sm text-[#5a6b66]">{rota.descricao}</p>
                    )}
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        )}

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeUp}
          className="mt-12 rounded-2xl border border-dashed border-[#1a4a3a]/25 bg-[#d4ede8]/40 px-6 py-4 text-center text-sm font-semibold text-[#1a4a3a]"
        >
          App completo em breve na App Store e no Google Play
        </motion.p>
      </div>
    </SectionReveal>
  );
}
