/** Shared paint filter; the original selectable HTML name remains the only text. */
export default function TypeMaterial() {
  return <svg className="type-material-defs" aria-hidden="true" focusable="false" width="0" height="0">
    <defs>
      <filter id="an-name-material" x="-3%" y="-8%" width="106%" height="116%" colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="soft-alpha" />
        <feComposite in="soft-alpha" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="inner-edge" />
        <feBlend in="SourceGraphic" in2="inner-edge" mode="overlay" result="material" />
        {/* Lift every material shade into silver; the reference's black/color map is omitted. */}
        <feComponentTransfer in="material" result="silver">
          <feFuncR type="linear" slope="0.42" intercept="0.58" />
          <feFuncG type="linear" slope="0.42" intercept="0.58" />
          <feFuncB type="linear" slope="0.42" intercept="0.58" />
        </feComponentTransfer>
        <feComposite in="silver" in2="SourceAlpha" operator="in" />
      </filter>
    </defs>
  </svg>;
}
