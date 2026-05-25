import { HOME_SECTION_EYEBROW_CLASS, HOME_SECTION_TITLE_CLASS } from "@/components/home/homeTokens";

/**
 * Cabeçalho editorial de seção na home.
 * @param {object} props
 * @param {string} [props.eyebrow]
 * @param {string} props.title
 * @param {string} [props.className]
 * @param {string} [props.titleId]
 */
export default function HomeSectionHeader({ eyebrow, title, className = "", titleId }) {
  return (
    <div className={`mb-4 ${className}`.trim()}>
      {eyebrow ? <p className={HOME_SECTION_EYEBROW_CLASS}>{eyebrow}</p> : null}
      <h2
        id={titleId}
        className={`${HOME_SECTION_TITLE_CLASS} ${eyebrow ? "mt-1" : ""}`}
      >
        {title}
      </h2>
    </div>
  );
}
