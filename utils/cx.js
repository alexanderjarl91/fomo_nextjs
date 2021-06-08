// a function that allows you to control classnames by booleans / states

//elements classname nextjs example:
// <div className={cx((styles.card, {[styles.animationClass]: showAnimation }))}>
//
//example will always include styles.card but only include styles.animationClass if showAnimation state is true

const cx = (...classes) => {
  return classes
    .map((_class) => {
      if (typeof _class === "string") return _class;
      if (typeof _class === "object") {
        const entries = Object.entries(_class);
        const [key, value] = entries[0];
        return Boolean(value) ? key : "";
      }
    })
    .join(" ");
};

export default cx;
