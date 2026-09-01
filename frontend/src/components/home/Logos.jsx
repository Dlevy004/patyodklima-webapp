import './Logos.css';

import LogoLoop from '@/animations/LogoLoop';

const brandLogos = [
  { src: "/logos/Aux.svg", alt: "AUX logo", href: "https://aux-magyarorszag.hu/" },
  { src: "/logos/ceklima.svg", alt: "Ceklima logo", href: "https://www.ceklima.hu/" },
  { src: "/logos/melegethu.svg", alt: "Melegethu logo", href: "https://www.meleget.hu/" },
  { src: "/logos/Midea.svg", alt: "Midea logo", href: "https://midea.hu/" },
  { src: "/logos/Gree.svg", alt: "Gree logo", href: "https://gree-magyarorszag.hu/" },
  { src: "/logos/TCL.svg", alt: "TCL logo", href: "https://www.tcl.com/hu/hu" },
];

function Logos() {
  return (
    <section className="logos-section">
      <h2 className="logos-title">Ezekkel a márkákkal dolgozunk:</h2>

      <div className="logos-container">
        <LogoLoop
          logos={brandLogos}
          speed={50}
          direction="left"
          logoHeight={50}
          gap={70}
          hoverSpeed={0}
          scaleOnHover
          ariaLabel="We work with these brands"
        />
      </div>
    </section>
  );
}

export default Logos;