import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}


/*

Todo:
- under the 'links' page I want to see a table with links (use dummy data),
  filter and display options, a search bar pagination, and a create link button
- under the 'analytics' page i need to show something.... but what?

- the location of the user (city/country/region/continent) [how do i do this???]
- maybe a graph that shows link clicks over time
- link type (qr vs link)
- browser type, etc.
- suppose for now, just fill the page with some generic analytic cards.

I like the data table from shadcn examples.

I could have it where you can filter over your urls and whichever urls you select the stats
reflect only those urls. that way we can easily see the stats for any url.




*/
