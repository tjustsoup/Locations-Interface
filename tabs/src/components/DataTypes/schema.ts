export const schema = {
  locations: {
    type: "locations",
    relationships: {
      geoframes: {
        type: "geoframes",
      },
      smartystreets: {
        type: "smartystreets",
      },
      googleplaces: {
        type: "googleplaces",
      },
    },
  },
  smartystreets: {
    type: "smartystreets",
    relationships: {
      location: {
        type: "locations",
      },
    },
  },
  googleplaces: {
    type: "googleplaces",
    relationships: {
      location: {
        type: "locations",
      },
    },
  },
  geoframes: {
    type: "geoframes",
    relationships: {
      location: {
        type: "locations",
      },
    },
  },
};
