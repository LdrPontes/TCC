export const school = 'https://cdn-icons-png.flaticon.com/512/2602/2602432.png';
export const university = 'https://cdn-icons-png.flaticon.com/512/2997/2997322.png';
export const bus_stop = 'https://cdn-icons-png.flaticon.com/512/2684/2684188.png';
export const bus_station = 'https://cdn-icons-png.flaticon.com/512/3033/3033310.png';

export const mapEntityToImage = (entity: string) => {
  switch (entity) {
    case 'School':
      return school;
    case 'University':
      return university;
    case 'Bus_Stop':
      return bus_stop;
    case 'Bus_Station':
      return bus_station;
    default:
      return '';
  }
}