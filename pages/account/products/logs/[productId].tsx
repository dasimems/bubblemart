import { getData } from "@/api";
import AccountContentLayout from "@/components/layouts/AccountContentLayout";
import SectionContainer from "@/components/layouts/SectionContainer";
import LogCard from "@/components/pages/products/logs/LogCard";
import EmptyContainer from "@/components/status/EmptyContainer";
import ErrorContainer from "@/components/status/ErrorContainer";
import { LogDetailsType } from "@/store/logStore";
import { constructErrorMessage } from "@/utils/functions";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

const LogList = () => {
  const params = useParams();
  const { push } = useRouter();
  const { productId } = params || {};
  const fetchProducts = useCallback(
    async ({ pageParam = null }: { pageParam?: number | null }) => {
      return getData<ApiCallResponseType<LogDetailsType[]>>(
        `/log/${productId}?page=${pageParam || 1}`
      );
    },
    [productId]
  );

  const [fetchedLogs, setFetchedLogs] = useState<LogDetailsType[] | null>(null);
  const [fetchingLogsError, setFetchingLogsError] = useState<string | null>(
    !productId ? "Product id not found!" : null
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    error
  } = useInfiniteQuery({
    queryKey: [`logs-${productId}`],
    queryFn: ({ pageParam }) => fetchProducts({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const hasNextLink = lastPage?.data?.nextLink;
      const activePage = lastPage?.data?.activePage || 0;
      return hasNextLink ? activePage + 1 : undefined;
    },
    enabled: !!productId
  });

  useEffect(() => {
    if (error) {
      setFetchingLogsError(
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
      setFetchedLogs(logDetails);
    }
  }, [data]);
  return (
    <AccountContentLayout>
      {!fetchedLogs && !fetchingLogsError && (
        <div className="flex flex-col gap-6">
          {new Array(6).fill(0).map((_, index) => (
            <div
              className="flex flex-col gap-3 bg-slate-200 max-w-[30rem] p-5 rounded-md"
              key={index}
            >
              <div className="w-[10rem] h-2 animate-pule bg-slate-300 rounded-full" />
              <div className="w-full h-5 animate-pule bg-slate-300 rounded-md" />
              <div className="w-full h-5 animate-pule bg-slate-300 rounded-md" />
            </div>
          ))}
        </div>
      )}
      {!fetchedLogs && fetchingLogsError && (
        <div>
          <ErrorContainer error={fetchingLogsError} retryFunction={refetch} />
        </div>
      )}
      {fetchedLogs && !fetchingLogsError && fetchedLogs.length > 0 && (
        <div className="flex flex-col gap-10">
          <div className="flex gap-10 items-center justify-between">
            <h1 className="font-bold">
              {fetchedLogs?.[0]?.productId?.name} Logs
            </h1>
          </div>
          <div className="flex gap-6">
            {fetchedLogs.map((item, index) => (
              <LogCard
                {...item}
                key={item?.id}
                index={index}
                refetch={refetch}
              />
            ))}
          </div>
        </div>
      )}
      {fetchedLogs && !fetchingLogsError && fetchedLogs.length < 1 && (
        <div>
          <EmptyContainer
            actionText="Add log"
            description="No logs found!"
            action={() => {
              push(`/account/products/edit?id=${productId}`);
            }}
          />
        </div>
      )}
    </AccountContentLayout>
  );
};

export default LogList;
