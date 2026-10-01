/** Shared paint filter; the original semantic HTML name remains the only text. */
export default function TypeMaterial() {
  return <svg className="type-material-defs" aria-hidden="true" focusable="false" width="0" height="0">
    <defs>
      <filter id="an-name-material" x="-6%" y="-15%" width="112%" height="130%" colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="soft-alpha" />
        <feComposite in="soft-alpha" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="inner-edge" />
        <feBlend in="SourceGraphic" in2="inner-edge" mode="overlay" result="material" />
        {/* Lift every material shade into silver; the reference's black/color map is omitted. */}
        <feComponentTransfer in="material" result="silver">
          <feFuncR type="linear" slope="0.42" intercept="0.58" />
          <feFuncG type="linear" slope="0.42" intercept="0.58" />
          <feFuncB type="linear" slope="0.42" intercept="0.58" />
        </feComponentTransfer>
        <feComposite in="silver" in2="SourceAlpha" operator="in" result="silver-text" />
        <feTurbulence type="fractalNoise" baseFrequency=".004 .02" numOctaves="1" seed="17" result="optical-field" />
        <feDisplacementMap id="an-name-displace" in="silver-text" in2="optical-field" scale="0" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>;
}
