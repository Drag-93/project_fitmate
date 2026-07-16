import { useSearchParams } from "react-router-dom";

const categories = [
  { label: "전체", value: undefined },
  { label: "PT", value: "PT" },
  { label: "헬스장", value: "GYM" },
  { label: "상품", value: "GOODS" },
  { label: "프리미엄", value: "PREMIUM" },
];

const CategoryMenu = () => {

  const [, setSearchParams] = useSearchParams();

  const changeCategory = (productType) => {
    if (!productType) {
      // 전체
      setSearchParams({});
    } else {
      setSearchParams({
        productType,
      });
    }
  };

  return (
    <div>
      {categories.map(category => (
        <button
          key={category.label}
          onClick={() => changeCategory(category.value)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryMenu;