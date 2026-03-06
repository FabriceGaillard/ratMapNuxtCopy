export default defineAppConfig({
  ui: {
    colors: {
      primary: "green",
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
    button: {
      variants: {
        color: {
          red: "text-white dark:text-white bg-red-600 hover:bg-red-700 disabled:bg-red-600",
          orange:
            "text-white dark:text-white bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600",
          yellow:
            "text-white dark:text-white bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-600",
          blue: "text-white dark:text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600",
          purple:
            "text-white dark:text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600",
          pink: "text-white dark:text-white bg-pink-600 hover:bg-pink-700 disabled:bg-pink-600",
          cyan: "text-white dark:text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600",
          indigo:
            "text-white dark:text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600",
        },
      },
    },
    dropdown: {
      variants: {
        color: {
          red: "text-red-600 dark:text-red-400 hover:text-red-700",
          orange: "text-orange-600 dark:text-orange-400 hover:text-orange-700",
          yellow: "text-yellow-600 dark:text-yellow-400 hover:text-yellow-700",
          blue: "text-blue-600 dark:text-blue-400 hover:text-blue-700",
          purple: "text-purple-600 dark:text-purple-400 hover:text-purple-700",
          pink: "text-pink-600 dark:text-pink-400 hover:text-pink-700",
          cyan: "text-cyan-600 dark:text-cyan-400 hover:text-cyan-700",
          indigo: "text-indigo-600 dark:text-indigo-400 hover:text-indigo-700",
        },
      },
    },
    dropdownMenu: {
      variants: {
        color: {
          red: {},
          orange: {},
          yellow: {},
          blue: {},
          purple: {},
          pink: {},
          cyan: {},
          indigo: {},
        },
      },
      compoundVariants: [
        {
          color: "red",
          active: false,
          class: {
            item: "text-red-600 data-highlighted:text-red-600 data-highlighted:before:bg-red-600/10 data-[state=open]:before:bg-red-600/10",
            itemLeadingIcon:
              "text-red-600/75 group-data-highlighted:text-red-600 group-data-[state=open]:text-red-600",
          },
        },
        {
          color: "red",
          active: true,
          class: {
            item: "text-red-600 before:bg-red-600/10",
            itemLeadingIcon: "text-red-600",
          },
        },
        {
          color: "orange",
          active: false,
          class: {
            item: "text-orange-600 data-highlighted:text-orange-600 data-highlighted:before:bg-orange-600/10 data-[state=open]:before:bg-orange-600/10",
            itemLeadingIcon:
              "text-orange-600/75 group-data-highlighted:text-orange-600 group-data-[state=open]:text-orange-600",
          },
        },
        {
          color: "orange",
          active: true,
          class: {
            item: "text-orange-600 before:bg-orange-600/10",
            itemLeadingIcon: "text-orange-600",
          },
        },
        {
          color: "yellow",
          active: false,
          class: {
            item: "text-yellow-600 data-highlighted:text-yellow-600 data-highlighted:before:bg-yellow-600/10 data-[state=open]:before:bg-yellow-600/10",
            itemLeadingIcon:
              "text-yellow-600/75 group-data-highlighted:text-yellow-600 group-data-[state=open]:text-yellow-600",
          },
        },
        {
          color: "yellow",
          active: true,
          class: {
            item: "text-yellow-600 before:bg-yellow-600/10",
            itemLeadingIcon: "text-yellow-600",
          },
        },
        {
          color: "blue",
          active: false,
          class: {
            item: "text-blue-600 data-highlighted:text-blue-600 data-highlighted:before:bg-blue-600/10 data-[state=open]:before:bg-blue-600/10",
            itemLeadingIcon:
              "text-blue-600/75 group-data-highlighted:text-blue-600 group-data-[state=open]:text-blue-600",
          },
        },
        {
          color: "blue",
          active: true,
          class: {
            item: "text-blue-600 before:bg-blue-600/10",
            itemLeadingIcon: "text-blue-600",
          },
        },
        {
          color: "purple",
          active: false,
          class: {
            item: "text-purple-600 data-highlighted:text-purple-600 data-highlighted:before:bg-purple-600/10 data-[state=open]:before:bg-purple-600/10",
            itemLeadingIcon:
              "text-purple-600/75 group-data-highlighted:text-purple-600 group-data-[state=open]:text-purple-600",
          },
        },
        {
          color: "purple",
          active: true,
          class: {
            item: "text-purple-600 before:bg-purple-600/10",
            itemLeadingIcon: "text-purple-600",
          },
        },
        {
          color: "pink",
          active: false,
          class: {
            item: "text-pink-600 data-highlighted:text-pink-600 data-highlighted:before:bg-pink-600/10 data-[state=open]:before:bg-pink-600/10",
            itemLeadingIcon:
              "text-pink-600/75 group-data-highlighted:text-pink-600 group-data-[state=open]:text-pink-600",
          },
        },
        {
          color: "pink",
          active: true,
          class: {
            item: "text-pink-600 before:bg-pink-600/10",
            itemLeadingIcon: "text-pink-600",
          },
        },
        {
          color: "cyan",
          active: false,
          class: {
            item: "text-cyan-600 data-highlighted:text-cyan-600 data-highlighted:before:bg-cyan-600/10 data-[state=open]:before:bg-cyan-600/10",
            itemLeadingIcon:
              "text-cyan-600/75 group-data-highlighted:text-cyan-600 group-data-[state=open]:text-cyan-600",
          },
        },
        {
          color: "cyan",
          active: true,
          class: {
            item: "text-cyan-600 before:bg-cyan-600/10",
            itemLeadingIcon: "text-cyan-600",
          },
        },
        {
          color: "indigo",
          active: false,
          class: {
            item: "text-indigo-600 data-highlighted:text-indigo-600 data-highlighted:before:bg-indigo-600/10 data-[state=open]:before:bg-indigo-600/10",
            itemLeadingIcon:
              "text-indigo-600/75 group-data-highlighted:text-indigo-600 group-data-[state=open]:text-indigo-600",
          },
        },
        {
          color: "indigo",
          active: true,
          class: {
            item: "text-indigo-600 before:bg-indigo-600/10",
            itemLeadingIcon: "text-indigo-600",
          },
        },
      ],
    },
    slider: {
      variants: {
        color: {
          gray: {
            root: "border-1 rounded border-gray-500",
            range: "bg-gray-200",
            thumb: "ring-gray-400 focus-visible:outline-gray-200/50",
            track: "bg-white",
          },
        },
      },
    },
    badge: {
      variants: {
        color: {
          red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
          orange:
            "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
          yellow:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
          blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
          purple:
            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
          pink: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
          cyan: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
          indigo:
            "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
        },
      },
    },
  },
});
