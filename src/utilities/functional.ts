type Case<IfType, ThenType> = {
  if: IfType;
  then: ThenType | undefined;
};

export const match = <IfType, ThenType>(cases: Case<IfType, ThenType>[]) => (
  defaultCase: ThenType,
) => (value: IfType): ThenType => {
  const reduction = cases.reduceRight(
    (
      resultSoFar: ThenType | undefined,
      currentCase: Case<IfType, ThenType>,
    ) => {
      if (currentCase.if === value) {
        return currentCase.then;
      }

      return resultSoFar;
    },
    undefined,
  );

  return reduction || defaultCase;
};
