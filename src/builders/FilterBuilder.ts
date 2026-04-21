export class FilterBuilder {
  constructor() { }
  public buildFilterWhere(
    name?: string,
    textOr?: Record<string, string>,
    fieldFilter?: Record<string, string>,
    fieldIn?: Record<string, (string | number)[]>
  ): Record<string, any> {
    const conditions: Record<string, any>[] = [];

    if (name) {
      conditions.push({
        name: {
          contains: name,
          mode: 'insensitive' as const,
        },
      });
    }

    if (fieldFilter && Object.keys(fieldFilter).length > 0) {
      conditions.push(
        ...Object.entries(fieldFilter).map(([field, value]) => ({
          [field]: value,
        }))
      );
    }

    if (fieldIn && Object.keys(fieldIn).length > 0) {
      conditions.push(
        ...Object.entries(fieldIn).map(([field, values]) => ({
          [field]: {
            in: values,
          },
        }))
      );
    }

    if (textOr && Object.keys(textOr).length > 0) {
      conditions.push({
        OR: Object.entries(textOr).map(([field, value]) => ({
          [field]: {
            contains: value,
            mode: 'insensitive' as const,
          },
        })),
      });
    }

    return conditions.length > 0 ? { AND: conditions } : {};
  }

  public buildFilterOrder(
    sortBy = 'id',
    sortOrder: 'asc' | 'desc' = 'asc',
  ): Record<string, 'asc' | 'desc'> {
    const order: Record<string, 'asc' | 'desc'> = {};
    order[sortBy] = sortOrder;
    return order;
  }
}
