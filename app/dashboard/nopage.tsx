// import AnimatedTabs from "./animated-tabs"
import { VercelNavbar } from "./navbar"

export default function Home() {
  return (
    <div>
      {/* <AnimatedTabs /> */}
      hello
      {/* <VercelNavbar />
      <main className="flex-1 container py-8">
        <div className="space-y-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Project {i + 1}</h2>
              <p className="text-muted-foreground">
                This is a sample project card to demonstrate the scrolling behavior of the navigation bar. As you scroll
                down, the primary navigation will disappear and the secondary navigation will stick to the top of the
                viewport.
              </p>
            </div>
          ))}
        </div>
      </main> */}
    </div>
  )
}

/*

How to set a default page to display?
ie. make /dashboard/a render by default

How to make /dashboard not render at all.

Then figure out how to structure it so that links and analytics display


(these 4 routes share a layout)
/
/learn-more
/resources
/change-log

(these 2 routes share a layout)
/auth/signin
/auth/forgot-password

(these 2 routes share a layout)
/dashboard/links
/dashboard/analytics
---------------------------------------
app/
  (auth)

  (marketing)/
    layout.tsx
    page.tsx                /
    solutions/
      page.tsx              /resources/learn-more
    resources/
      page.tsx              /resources

  dashboard/
    layout.tsx
    links/                  /dashboard/links
      page.tsx
    analytics/
      page.tsx              /dashboard/analytics












*/
