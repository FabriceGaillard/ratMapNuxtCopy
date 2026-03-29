export default defineAppConfig({
  ui: {
    colors: {
      primary: "brand",
      neutral: "slate",
      red: "red",
      orange: "orange",
      yellow: "yellow",
      green: "green",
      blue: "blue",
      purple: "purple",
      pink: "pink",
      cyan: "cyan",
      indigo: "indigo",
    },
    slider: {
      variants: {
        color: {
          gray: {
            root: "rounded border-gray-400",
            range: "bg-accented",
            thumb: "ring-gray-400 focus-visible:outline-gray-200/50",
            track: "bg-muted",
          },
        },
      },
    },
    drawer: {
      slots: {
        content: "!rounded-t-[1.5rem] ring-transparent ",
        handle: "!mt-2 !h-1",
        container: "!py-2 ",
      },
    },
    button: {
      slots: {
        base: "rounded-full",
      },
      compoundVariants: [
        {
          color: "primary",
          variant: "solid",
          class: "!text-black",
        },
      ],
    },
  },
});
