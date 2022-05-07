import { useState } from "react";
import { TransferForm } from "./transferForm";
import { combineClassNames } from "../../utils/html";
import { TopupForm } from "./topupForm";
import { WithdrawForm } from "./withdrawForm";

export function Transaction() {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const tabs = [{ name: "Transfer" }, { name: "Topup" }, { name: "Withdraw" }];

  return (
    <>
      <div className="">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4" aria-label="Tabs">
            {tabs.map((tab, i) => (
              <a
                key={i}
                href="#"
                className={combineClassNames(
                  currentSection == i
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                  "w-1/3 py-2 px-1 text-center border-b-2 font-medium text-sm"
                )}
                aria-current={currentSection == i ? "page" : undefined}
                onClick={() => setCurrentSection(i)}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
        <section
          className={combineClassNames(
            currentSection == 0 ? "" : "hidden",
            "mt-2"
          )}
        >
          <TransferForm />
        </section>
        <section
          className={combineClassNames(
            currentSection == 1 ? "" : "hidden",
            "mt-2"
          )}
        >
          <TopupForm />
        </section>
        <section
          className={combineClassNames(
            currentSection == 2 ? "" : "hidden",
            "mt-2"
          )}
        >
          <WithdrawForm />
        </section>
      </div>
    </>
  );
}
