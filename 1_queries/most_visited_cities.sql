select 
properties.city,
count(reservations.id) as total_reservations
from properties
join reservations on properties.id= reservations.property_id
group by properties.city
order by total_reservations DESC; 