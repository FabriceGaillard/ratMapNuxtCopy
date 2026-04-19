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
        content: "!rounded-t-[1.5rem] ring-transparent",
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
          class: "!text-neutral-800",
        },
      ],
    },

    dropdownMenu: {
      variants: {
        color: {
          pink: "",
          brand: "",
        },
      },
      compoundVariants: [
        {
          color: "pink" as const,
          active: false,
          class: {
            item: "text-pink-500 data-highlighted:text-pink-500 data-highlighted:before:bg-pink-500/10 data-[state=open]:before:bg-pink-500/10",
            itemLeadingIcon:
              "text-pink-500/75 group-data-highlighted:text-pink-500 group-data-[state=open]:text-pink-500",
          },
        },
        {
          color: "pink" as const,
          active: true,
          class: {
            item: "text-pink-500 before:bg-pink-500/10",
            itemLeadingIcon: "text-pink-500",
          },
        },
        {
          color: "brand" as const,
          active: false,
          class: {
            item: "text-brand-700 data-highlighted:text-brand-700 data-highlighted:before:bg-brand-600/10 data-[state=open]:before:bg-brand-600/10",
            itemLeadingIcon:
              "text-brand-700/75 group-data-highlighted:text-brand-700 group-data-[state=open]:text-brand-700",
          },
        },
        {
          color: "brand" as const,
          active: true,
          class: {
            item: "text-brand-700 before:bg-brand-600/10",
            itemLeadingIcon: "text-brand-700",
          },
        },
      ],
    },
  },
});
