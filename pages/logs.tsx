import { getData } from "@/api";
import PageLayout from "@/components/layouts/PageLayout";
import SectionContainer from "@/components/layouts/SectionContainer";
import EmptyContainer from "@/components/status/EmptyContainer";
import ErrorContainer from "@/components/status/ErrorContainer";
import protectRoute from "@/hooks/protectRoute";
import { LogDetailsType } from "@/store/logStore";
import { constructErrorMessage } from "@/utils/functions";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { use, useCallback, useEffect, useRef, useState } from "react";
import { FaAngleDown, FaAngleLeft, FaAngleUp } from "react-icons/fa";

const LogCard: React.FC<{
  title: string;
  username: string;
  password: string;
}> = ({ title, username, password }) => {
  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const toggleHeight = useCallback(() => {
    const element = ref?.current;
    if (!element) {
      return;
    }
    setHeight((prevState) => (prevState ? 0 : element.clientHeight));
  }, []);
  return (
    <div className="w-full border rounded-md">
      <button
        onClick={toggleHeight}
        title={!!height ? "Close" : "Open"}
        className="flex items-center justify-between gap-6 font-medium w-full py-4 px-7"
      >
        <span>{title}</span>
        <span className="opacity-60">
          {!height && <FaAngleDown />}
          {!!height && <FaAngleUp />}
        </span>
      </button>
      <div
        className="overflow-hidden px-10 transition-all duration-300"
        style={{ height: `${height}px` }}
      >
        <div
          ref={ref}
          className={`py-10 ${
            !!height && "border-t"
          } flex flex-col items-start gap-3`}
        >
          <p>
            <span className="text-opacity-60">Username: </span>
            <span className="font-medium">{username}</span>
          </p>
          <p>
            <span className="text-opacity-60">Password: </span>
            <span className="font-medium">{password}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const Logs = () => {
  const { back, push } = useRouter();
  const fetchProducts = async ({
    pageParam = null
  }: {
    pageParam?: number | null;
  }) => {
    return getData<ApiCallResponseType<LogDetailsType[]>>(
      `/log?page=${pageParam || 1}`
    );
  };
  const [logData, setLogData] = useState<LogDetailsType[] | null>(null);
  const [fetchingLogDetailsError, setFetchingLogDetailsError] = useState<
    string | null
  >(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    error
  } = useInfiniteQuery({
    queryKey: ["purchased-logs"],
    queryFn: ({ pageParam }) => fetchProducts({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const hasNextLink = lastPage?.data?.nextLink;
      const activePage = lastPage?.data?.activePage || 0;
      return hasNextLink ? activePage + 1 : undefined;
    }
  });

  useEffect(() => {
    if (error) {
      setFetchingLogDetailsError(
        constructErrorMessage(
          error as ApiErrorResponseType,
          "Unknown error occurred whilst fetching logs"
        )
      );
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      const logDetails = data?.pages.flatMap((page) => page.data?.data) ?? [];
      setLogData(logDetails);
    }
  }, [data]);

  return (
    <PageLayout>
      <SectionContainer>
        <div className="flex items-center">
          <button onClick={back} className="inline-flex items-center gap-1">
            <span>
              <FaAngleLeft />
            </span>
            <span>Back</span>
          </button>
        </div>
      </SectionContainer>
      {!fetchingLogDetailsError && logData && (
        <SectionContainer>
          {logData.length > 0 &&
            logData.map((log) => (
              <LogCard
                key={log?.id}
                title={log?.productId?.name}
                username={log?.email}
                password={log?.password}
              />
            ))}
          {logData?.length < 1 && (
            <EmptyContainer description="No logs found!" />
          )}
        </SectionContainer>
      )}
      {fetchingLogDetailsError && (
        <SectionContainer>
          <ErrorContainer
            error={fetchingLogDetailsError}
            retryFunction={refetch}
          />
        </SectionContainer>
      )}
      {!fetchingLogDetailsError && !logData && (
        <SectionContainer contentContainerClassName="flex flex-col gap-4">
          {new Array(6).fill(0).map((_, index) => (
            <div
              className="flex flex-col gap-2 bg-slate-50 py-3 px-6 rounded-md"
              key={index}
            >
              <div
                key={index}
                className="w-[8rem] h-2 bg-gray-300 rounded-full animate-pulse"
              />
              <div
                key={index}
                className="w-[15rem] h-2 bg-gray-300 rounded-full animate-pulse"
              />
            </div>
          ))}
        </SectionContainer>
      )}
    </PageLayout>
  );
};

export default protectRoute(Logs);
