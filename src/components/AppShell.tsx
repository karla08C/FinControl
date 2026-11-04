import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { ArrowDownCircle, LayoutDashboard, LogOut, Receipt, TrendingUp, UserRound, Wallet } from "lucide-react";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/receitas", label: "Receitas", icon: ArrowDownCircle },
  { to: "/despesas", label: "Despesas", icon: Receipt },
  { to: "/orcamento", label: "Orçamento", icon: Wallet },
  { to: "/investimentos", label: "Investimentos", icon: TrendingUp },
  { to: "/perfil", label: "Perfil", icon: UserRound },
] as const;

// Itens principais para a barra de navegação inferior no mobile
const mobileBottomNav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/receitas", label: "Receitas", icon: ArrowDownCircle },
  { to: "/despesas", label: "Despesas", icon: Receipt },
  { to: "/orcamento", label: "Orçamento", icon: Wallet },
  { to: "/investimentos", label: "Investir", icon: TrendingUp },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut().catch(() => {});
    window.location.href = "/";
  };

  const displayName = (user.user_metadata?.full_name as string | undefined) || user.email || "";
  const initial = (displayName[0] || "?").toUpperCase();

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full bg-background">
      {/* Top Header Mobile */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b bg-card/95 px-4 py-3 backdrop-blur">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold text-sm">
            F
          </div>
          <span className="font-semibold text-base leading-none">FinControl</span>
        </Link>

        {/* Dropdown de Usuário Mobile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Abrir menu do usuário"
            >
              <Avatar className="size-8 bg-primary text-primary-foreground text-xs font-semibold cursor-pointer">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {initial}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none truncate">{displayName}</p>
                <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/perfil" className="flex items-center gap-2 cursor-pointer w-full">
                <UserRound className="size-4" />
                <span>Meu Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={signOut}
              className="flex items-center gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
            >
              <LogOut className="size-4" />
              <span>Sair da conta</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:w-64 md:min-h-screen border-r bg-card md:sticky md:top-0 md:h-screen flex-col">
        <div className="px-5 py-5 flex items-center gap-2">
          <div className="size-9 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold">F</div>
          <div>
            <div className="font-semibold leading-tight">FinControl</div>
            <div className="text-xs text-muted-foreground">Despesas & Investimentos</div>
          </div>
        </div>

        <nav className="px-2 pb-4 flex flex-col gap-1 flex-1">
          {nav.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-3">
          <Link
            to="/perfil"
            className="mb-2 flex items-center gap-2 rounded-md p-1 transition-colors hover:bg-accent"
          >
            <Avatar className="size-8 bg-primary text-primary-foreground text-xs font-semibold">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{displayName}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            </div>
          </Link>
          <Button variant="outline" size="sm" className="w-full" onClick={signOut}>
            <LogOut className="size-4 mr-2" /> Sair
          </Button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 min-w-0 pb-20 md:pb-6">{children}</main>

      {/* Barra de Navegação Inferior Mobile */}
      <nav
        aria-label="Navegação inferior mobile"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t bg-card/95 py-1.5 px-1 backdrop-blur shadow-lg"
      >
        {mobileBottomNav.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-2 text-xs font-medium transition-colors rounded-lg flex-1 min-w-0",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("size-5 mb-0.5", active ? "stroke-[2.5]" : "stroke-[1.8]")} />
              <span className="truncate text-[11px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
