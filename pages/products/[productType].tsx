import SelectBox from "@/components/general/SelectBox";
import PageLayout from "@/components/layouts/PageLayout";
import SectionContainer from "@/components/layouts/SectionContainer";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import AllProductList from "@/components/pages/products/ProductList";
import React from "react";

const options: SelectOptionType[] = [
  { label: "Logs", value: "logs" },
  { label: "Gifts", value: "gifts" }
];

const ProductList = () => {
  const params = useParams();
  const { push } = useRouter();
  return (
    <PageLayout>
      <SectionContainer className="">
        <SelectBox
          options={options}
          value={params?.productType}
          hideEmptyOption
          onChange={(e) => {
            const { value } = e.target as HTMLSelectElement;
            push(`/products/${value}`);
          }}
          inputClassName="bg-transparent max-w-[6rem] border-none"
        />
      </SectionContainer>

      <AllProductList />
    </PageLayout>
  );
};

export default ProductList;
