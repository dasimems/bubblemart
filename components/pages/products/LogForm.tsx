import InputField from "@/components/general/InputField";
import { Trash } from "iconsax-react";
import React, { useCallback, useEffect, useState } from "react";

export type LogBodyType = {
  email: string;
  password: string;
  error?: string;
};

export const logInitialValue = {
  email: "",
  password: ""
};

const isChangeInLogs = (logOne: LogBodyType[], logTwo: LogBodyType[]) => {
  const isLengthEqual = logOne.length === logTwo.length;

  if (!isLengthEqual) {
    return true;
  }

  return logOne.some((log, index) => {
    const logTwoValue = logTwo[index];
    return (
      log.email !== logTwoValue.email || log.password !== logTwoValue.password
    );
  });
};

const LogForm: React.FC<{
  onChange: (logs: LogBodyType[]) => void;
  logs: LogBodyType[];
}> = ({ onChange, logs: sentLogs }) => {
  const [logs, setLogs] = useState<LogBodyType[]>([logInitialValue]);
  const changeValue = useCallback(
    (sentIndex: number, sentValue: LogBodyType) => {
      setLogs((prevState) => {
        const newValue = prevState.map((value, index) =>
          index === sentIndex ? sentValue : value
        );
        onChange(newValue);
        return newValue;
      });
    },
    [onChange]
  );

  const deleteLog = useCallback(
    (index: number) => {
      setLogs((prevState) => {
        const newValue = prevState.filter((_, i) => i !== index);
        onChange(newValue);
        return newValue;
      });
    },
    [onChange]
  );

  //   useEffect(() => {
  //     if (isChangeInLogs(logs, sentLogs)) {
  //       onChange(logs);
  //     }
  //   }, [logs, onChange, sentLogs]);
  useEffect(() => {
    if (sentLogs.length > 0 && isChangeInLogs(logs, sentLogs)) {
      setLogs(sentLogs);
    }
  }, [sentLogs, logs]);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-medium">Logs</h2>
      {logs.map(({ email, password, error }, index) => {
        return (
          <div
            className="flex flex-col gap-2 p-6 border border-dotted rounded-md relative border-slate-400"
            key={index}
          >
            {logs.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  deleteLog(index);
                }}
                title="remove log"
                className="absolute top-2 right-2"
              >
                <Trash className="text-red-600" />
              </button>
            )}
            <InputField
              label="Email/Username"
              value={email}
              onChange={(e) => {
                const inputtedValue = (e?.target as HTMLInputElement)?.value;
                changeValue(index, {
                  email: inputtedValue,
                  password
                });
              }}
            />
            <InputField
              label="Password"
              value={password}
              onChange={(e) => {
                const inputtedValue = (e?.target as HTMLInputElement)?.value;
                changeValue(index, {
                  email,
                  password: inputtedValue
                });
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default LogForm;
