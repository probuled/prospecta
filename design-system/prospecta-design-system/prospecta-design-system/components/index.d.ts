import type * as React from 'react';
export type IconName = 'search'|'pin'|'chevron-down'|'whatsapp'|'list'|'columns'|'download'|'sliders'|'globe-off'|'at'|'link'|'users'|'history'|'message'|'sun'|'moon'|'monitor'|'arrow-up-right'|'smartphone'|'star'|'plus';
export type Temperature = 'quente' | 'morno' | 'frio';
export type LeadStatus = 'novo' | 'contatado' | 'respondeu' | 'negociando' | 'fechado' | 'perdido';
export type PresenceKind = 'sem-site' | 'rede-social' | 'site';
export interface Lead { name: string; category: string; city: string; score: number; presence: PresenceKind; rating: number; reviews?: number; phone: string; status?: LeadStatus; dragging?: boolean }

export interface LogoProps { variant?: 'wordmark' | 'symbol'; height?: number; src?: { light: string; dark: string }; className?: string }
export declare function Logo(props: LogoProps): React.ReactElement;
export interface IconProps { name: IconName; size?: number; strokeWidth?: number; label?: string; className?: string }
export declare function Icon(props: IconProps): React.ReactElement;
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary' | 'ghost'; size?: 'sm' | 'md' | 'lg'; icon?: IconName; iconOnly?: boolean }
export declare function Button(props: ButtonProps): React.ReactElement;
export interface SegmentedControlProps { options: { value: string; label: string; icon?: IconName }[]; value?: string; defaultValue?: string; onChange?: (v: string) => void; iconOnly?: boolean; block?: boolean; label?: string }
export declare function SegmentedControl(props: SegmentedControlProps): React.ReactElement;
export interface SearchBarProps { niche?: string; city?: string; nicheLabel?: string; cityLabel?: string; nichePlaceholder?: string; cityPlaceholder?: string; submitLabel?: string; busy?: boolean; onSubmit?: () => void }
export declare function SearchBar(props: SearchBarProps): React.ReactElement;
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { icon?: IconName; width?: number | string }
export declare function Input(props: InputProps): React.ReactElement;
export interface SelectProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { value: string; label?: string; icon?: IconName; active?: boolean; size?: 'sm' | 'md' }
export declare function Select(props: SelectProps): React.ReactElement;
export interface TagListProps { items: string[]; label?: string; selected?: string; defaultSelected?: string; onSelect?: (t: string) => void }
export declare function TagList(props: TagListProps): React.ReactElement;
export interface SwitchProps { checked?: boolean; defaultChecked?: boolean; onChange?: (on: boolean) => void; title?: string; description?: string }
export declare function Switch(props: SwitchProps): React.ReactElement;
export interface SliderProps { label: string; min?: number; max?: number; value?: number; defaultValue?: number; onChange?: (v: number) => void; format?: (v: number) => string; hint?: string }
export declare function Slider(props: SliderProps): React.ReactElement;
export interface PanelProps { title?: string; action?: React.ReactNode; children?: React.ReactNode; className?: string }
export declare function Panel(props: PanelProps): React.ReactElement;
export interface DisclosureProps { title: string; summary?: string; icon?: IconName; defaultOpen?: boolean; children?: React.ReactNode }
export declare function Disclosure(props: DisclosureProps): React.ReactElement;
export interface MetricStripProps { items: { label: string; value: string; note?: string }[] }
export declare function MetricStrip(props: MetricStripProps): React.ReactElement;
export interface ScoreProps { value: number; variant?: 'inline' | 'badge'; showWord?: boolean }
export declare function Score(props: ScoreProps): React.ReactElement;
export interface PresenceProps { kind: PresenceKind }
export declare function Presence(props: PresenceProps): React.ReactElement;
export interface RatingProps { value: number; count?: number }
export declare function Rating(props: RatingProps): React.ReactElement;
export interface StatusProps { status: LeadStatus; static?: boolean }
export declare function Status(props: StatusProps): React.ReactElement;
export interface LeadTableProps { leads: Lead[] }
export declare function LeadTable(props: LeadTableProps): React.ReactElement;
export interface PipelineCardProps { lead: Lead; dragging?: boolean }
export declare function PipelineCard(props: PipelineCardProps): React.ReactElement;
export interface PipelineBoardProps { columns: { status: LeadStatus; leads: Lead[] }[] }
export declare function PipelineBoard(props: PipelineBoardProps): React.ReactElement;
export interface SidebarProps { current?: string; collapsed?: boolean; items?: { id: string; label: string; icon: IconName; count?: number }[]; onNavigate?: (id: string) => void; engineOnline?: boolean; engineNote?: string; theme?: 'light' | 'dark' | 'system'; onThemeChange?: (t: string) => void }
export declare function Sidebar(props: SidebarProps): React.ReactElement;
export declare function scoreTemperature(score: number): Temperature;
declare global { interface Window { Prospecta: { Logo: typeof Logo; Icon: typeof Icon; Button: typeof Button; SegmentedControl: typeof SegmentedControl; SearchBar: typeof SearchBar; Input: typeof Input; Select: typeof Select; TagList: typeof TagList; Switch: typeof Switch; Slider: typeof Slider; Panel: typeof Panel; Disclosure: typeof Disclosure; MetricStrip: typeof MetricStrip; Score: typeof Score; Presence: typeof Presence; Rating: typeof Rating; Status: typeof Status; LeadTable: typeof LeadTable; PipelineCard: typeof PipelineCard; PipelineBoard: typeof PipelineBoard; Sidebar: typeof Sidebar; scoreTemperature: typeof scoreTemperature } } }
