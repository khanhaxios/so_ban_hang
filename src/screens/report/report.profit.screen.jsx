import { HStack, VStack } from "native-base";
import { useState } from "react";
import FilterSection from "../../components/filter/FilterSection.cpn";

function ReportProfitScreen() {
    const [dataFake, setDataFake] = useState([
      
      ]);
      
  const [filteredData, setFilteredData] = useState(dataFake);
    return ( 
        <VStack>
        <VStack>
          <HStack justifyContent="space-around">
            <VStack width={"35%"}>
              <FilterSection
                setFilteredData={setFilteredData}
                data={dataFake}
              />
            </VStack>
          </HStack>
        </VStack>
        </VStack>
     );
}

export default ReportProfitScreen;