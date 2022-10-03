import React, { useState, useEffect, useDebugValue } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import ResultCard from "../../components/theme/ResultCard";
import styles from "./result.module.scss";
import Loading from "../../components/layouts/Loading";
import { indexRes, themeRecommend } from "../api/recommend";
import { storeDataType } from "../../constants/storeData";

const Result = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [choices, storeIndex]: any = router.query.params || [];
  const [foodList, setFoodList] = useState([]);
  const [storeList, setStoreList] = useState<string[]>([]);

  // 제일 처음 실행
  useEffect(() => {
    setIsLoading(true);
    // 즉시 실행 함수
    (async function () {
      //  api 호출
      const res = await indexRes(storeIndex);
      setFoodList(res);
    })();

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [storeIndex]);

  useEffect(() => {
    // 정규 표현식
    const numTest = /^[0-1]{5}$/;

    if (numTest.test(choices) === false) {
      router.push("/404");
    }
    if (router.query.params?.length !== 2) {
      router.push("/404");
    }
  }, []);
  const again = () => {
    // api 재호출
    setIsLoading(true);

    (async function () {
      const res = await themeRecommend(choices);
      console.log(res);
      setStoreList(res);
      const index = res.join();
      router.push(`/theme/${choices}/${index}`);
      // setIsFinished(true);
    })();
  };

  return (
    <div className={`${styles.result} flex justify-center`}>
      <div
        className={`${styles.contents} flex column align-center justify-center`}
      >
        {!isLoading && foodList && (
          <div className="flex column align-center justify-center">
            <div className={`${styles.title} fs-24 coreBold`}>오늘 당신은</div>
            <div className="flex">
              {/* {foodList.map(
                ({
                  id,
                  mainImageURL,
                  menuImageUrl,
                  menuList,
                  name,
                  rating,
                  searchKeyword,
                  storUrl,
                  storeIdx,
                  역명
                }: storeDataType) => (
                  // <ResultCard
                  //   key={id}
                  //   id={id}
                  //   mainImageURL={mainImageURL}
                  //   menuImageUrl={menuImageUrl}
                  //   menuList={menuList}
                  //   name={name}
                  //   rating={rating}
                  //   searchKeyword={searchKeyword}
                  //   storUrl={storUrl}
                  //   storeIdx={storeIdx}
                  //   역명={역명}
                  // />
                )
              )} */}
            </div>

            <div className={`${styles.btns} flex`}>
              <button
                onClick={() => {
                  again();
                }}
                type="button"
                className={`${styles.btn} notoBold `}
              >
                다른 메뉴 추천 받기
              </button>
              <button
                onClick={() => {
                  router.push("/");
                }}
                type="button"
                className={`${styles.btn} notoBold `}
              >
                홈으로 돌아가기
              </button>
            </div>
          </div>
        )}
        {isLoading && <Loading />}
      </div>
    </div>
  );
};

export default Result;
