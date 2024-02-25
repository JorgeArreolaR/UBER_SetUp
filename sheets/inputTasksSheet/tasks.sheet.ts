const TasksSheetFactory = new GoogleSheetFactory({
  columns: {
    country_code: String(),
    city_name: String(),
    bub_week: String(),
    local_date: String(),

    local_hour: Number(),
    local_minute: Number(),
    route_id: String(),
    time_period: String(),
    from_addressLine1: String(),
    from_addressLine2: String(),
    to_addressLine1: String(),
    to_addressLine2: String(),
    flng: String(),
    flat: String(),
    tlng: String(),
    tlat: String(),
    distance_type: String(),

    split_id: Number(),

    analyst_prefix: String(),
    daymonth: String(),
    city_prefix: String(),

    photo_name: String(),
  },
})
