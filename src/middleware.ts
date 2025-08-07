import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const isAuthRoute =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/sign-up";

  if (isAuthRoute) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Use request.nextUrl.origin instead of environment variable
        return NextResponse.redirect(new URL("/", request.nextUrl.origin));
      }
    } catch (error) {
      console.error("Auth check error:", error);
      // Continue with the request if auth check fails
    }
  }

  const { searchParams, pathname } = new URL(request.url);

  if (!searchParams.get("noteId") && pathname === "/") {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Use absolute URL with request.nextUrl.origin
        const baseUrl = request.nextUrl.origin;
        
        try {
          const newestNoteResponse = await fetch(
            `${baseUrl}/api/fetch-newest-note?userId=${user.id}`,
            {
              // Add headers to ensure proper request handling
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          
          if (!newestNoteResponse.ok) {
            throw new Error(`HTTP error! status: ${newestNoteResponse.status}`);
          }
          
          const { newestNoteId } = await newestNoteResponse.json();

          if (newestNoteId) {
            const url = request.nextUrl.clone();
            url.searchParams.set("noteId", newestNoteId);
            return NextResponse.redirect(url);
          } else {
            // Create new note
            const createNoteResponse = await fetch(
              `${baseUrl}/api/create-new-note?userId=${user.id}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            
            if (!createNoteResponse.ok) {
              throw new Error(`HTTP error! status: ${createNoteResponse.status}`);
            }
            
            const { noteId } = await createNoteResponse.json();
            
            if (noteId) {
              const url = request.nextUrl.clone();
              url.searchParams.set("noteId", noteId);
              return NextResponse.redirect(url);
            }
          }
        } catch (fetchError) {
          console.error("API fetch error:", fetchError);
          // Continue with the request if API calls fail
        }
      }
    } catch (error) {
      console.error("User check error:", error);
      // Continue with the request if user check fails
    }
  }

  return supabaseResponse;
}