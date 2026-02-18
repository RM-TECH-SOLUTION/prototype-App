import React, { useEffect, useState } from "react";
import { View } from "react-native";
import HomeTabs from "../component/HomeTabs";
import useCmsStore from "../store/useCmsStore";

/* 🔹 CMS NORMALIZER */
const normalizeCmsFields = (cms) => {
  // CMS as ARRAY (slider, trending, arrivals)
  if (Array.isArray(cms)) {
    return cms.map((item) =>
      Object.values(item).reduce((acc, field) => {
        acc[field.fieldKey] = field.fieldValue;
        return acc;
      }, {})
    );
  }

  // CMS as OBJECT (homeBanner)
  if (cms && typeof cms === "object") {
    return Object.values(cms).reduce((acc, field) => {
      acc[field.fieldKey] = field.fieldValue;
      return acc;
    }, {});
  }

  return null;
};

const HomeContainer = () => {
  const { cmsData, getCmsData } = useCmsStore();

  const [homeBanner, setHomeBanner] = useState(null);
  const [homeScreenSlider, setHomeScreenSlider] = useState([]);
  const [trendingNow, setTrendingNow] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  /* FETCH CMS */
  useEffect(() => {
    getCmsData();
  }, []);

  /* PROCESS CMS */
  useEffect(() => {
    if (!Array.isArray(cmsData)) return;

    cmsData.forEach((item) => {
      switch (item.modelSlug) {
        case "homeBanner":
          setHomeBanner(normalizeCmsFields(item.cms));
          break;

        case "homeScreenSlider":
          setHomeScreenSlider(normalizeCmsFields(item.cms) || []);
          break;

        case "trendingNow":
          setTrendingNow(normalizeCmsFields(item.cms) || []);
          break;

        case "newArrivals":
          setNewArrivals(normalizeCmsFields(item.cms) || []);
          break;

        default:
          break;
      }
    });
  }, [cmsData]);

  console.log("homeBanner:", homeBanner);

  return (
    <View style={{ flex: 1 }}>
      <HomeTabs
        homeBanner={homeBanner}
        homeScreenSlider={homeScreenSlider}
        trendingNow={trendingNow}
        newArrivals={newArrivals}
      />
    </View>
  );
};

export default HomeContainer;
