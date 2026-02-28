import React, { useEffect, useState } from "react";
import { View } from "react-native";
import WalkthroughComponent from "../component/WalkthroughComponent";
import useCmsStore from "../store/useCmsStore";

const WalkthroughContainer = ({ navigation }) => {
  const { cmsData, getCmsData } = useCmsStore();
  const [walkthroughData, setWalkthroughData] = useState([]);

  useEffect(() => {
    if (!Array.isArray(cmsData)) return;

    const walkthroughItem = cmsData.find(
      (item) => item.modelSlug === "walkthroughSliders"
    );

    if (!walkthroughItem || !Array.isArray(walkthroughItem.cms)) return;

    const formattedData = walkthroughItem.cms.map((slide) => ({
      title: slide.title?.fieldValue || "",
      description: slide.discription?.fieldValue || "",
      image:
      slide.walkthroughImage?.fieldValue ||
      slide.walkthroughContantImage?.fieldValue ||
      null,
    }));

    setWalkthroughData(formattedData);
  }, [cmsData]);



  return (
    <View style={{ flex: 1 }}>
      <WalkthroughComponent
        walkthroughData={walkthroughData}
        onFinish={() => navigation.replace("Auth")}
      />
    </View>
  );
};

export default WalkthroughContainer;
