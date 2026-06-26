"""
Sandpile Model Animation — Self-Organized Criticality
Renders mathematical animations explaining the sandpile model from Chapter 8
"""

from manim import *
import numpy as np


class SandpileIntro(Scene):
    """Introduction to the sandpile model concept"""

    def construct(self):
        # Title sequence
        title = Text("Self-Organized Criticality", font_size=64, weight=BOLD)
        subtitle = Text("The Sandpile Model", font_size=48, color=BLUE)
        subtitle.next_to(title, DOWN, buff=0.5)

        title_group = VGroup(title, subtitle)
        title_group.center()

        self.play(Write(title))
        self.wait(1)
        self.play(Write(subtitle))
        self.wait(2)

        # Transition
        self.play(FadeOut(title_group))
        self.wait(0.5)


class SandpileGrid(Scene):
    """Visualize a 2D cellular automaton grid"""

    def construct(self):
        # Create grid of cells
        grid_size = 5
        cell_size = 0.6

        # Create cells with random initial heights
        grid = VGroup()
        heights = np.random.randint(0, 5, size=(grid_size, grid_size))

        colors_map = {0: LIGHT_GRAY, 1: YELLOW, 2: ORANGE, 3: RED, 4: DARK_RED}

        for i in range(grid_size):
            for j in range(grid_size):
                cell = Square(side_length=cell_size, stroke_width=2)
                cell.shift((i - grid_size/2) * cell_size * RIGHT +
                          (j - grid_size/2) * cell_size * UP)
                height = heights[i, j]
                cell.set_fill(colors_map[height], opacity=0.7)

                # Add height label
                label = Text(str(height), font_size=20)
                label.move_to(cell)
                grid.add(cell, label)

        grid.center()

        # Animate grid creation
        self.play(Create(grid), run_time=2)
        self.wait(2)

        # Highlight critical cell (height >= 3)
        critical_cells = []
        for i in range(grid_size):
            for j in range(grid_size):
                if heights[i, j] >= 3:
                    idx = i * grid_size * 2 + j * 2
                    critical_cells.append(grid[idx])

        if critical_cells:
            critical_group = VGroup(*critical_cells)
            self.play(Indicate(critical_group), color=RED, run_time=1.5)

        self.wait(1)


class ToppleAnimation(Scene):
    """Show a cell toppling and spreading to neighbors"""

    def construct(self):
        # Create central grid
        grid_size = 7
        cell_size = 0.5

        cells = []
        grid = VGroup()

        for i in range(grid_size):
            for j in range(grid_size):
                cell = Square(side_length=cell_size, stroke_width=1.5,
                             stroke_color=GRAY)
                cell.shift((i - grid_size/2) * cell_size * RIGHT +
                          (j - grid_size/2) * cell_size * UP)
                cell.set_fill(LIGHT_GRAY, opacity=0.5)
                cells.append(cell)
                grid.add(cell)

        grid.center()
        self.add(grid)

        # Highlight center cell
        center_idx = (grid_size * grid_size) // 2
        center_cell = cells[center_idx]

        # Animate topple
        self.play(center_cell.animate.set_fill(RED, opacity=0.9), run_time=0.5)
        self.wait(0.5)

        # Spread to neighbors (up, down, left, right)
        neighbor_indices = [
            center_idx - grid_size,  # up
            center_idx + grid_size,  # down
            center_idx - 1,          # left
            center_idx + 1           # right
        ]

        neighbor_cells = [cells[idx] for idx in neighbor_indices
                         if 0 <= idx < len(cells)]

        # Cascade animation
        for i, neighbor in enumerate(neighbor_cells):
            self.play(neighbor.animate.set_fill(ORANGE, opacity=0.8),
                     run_time=0.3)

        self.wait(1)

        # Reset colors
        self.play(center_cell.animate.set_fill(LIGHT_GRAY, opacity=0.5),
                 *[n.animate.set_fill(LIGHT_GRAY, opacity=0.5)
                   for n in neighbor_cells],
                 run_time=0.5)
        self.wait(0.5)


class AvalancheMagnitude(Scene):
    """Show distribution of avalanche sizes (power law)"""

    def construct(self):
        # Create axes
        axes = Axes(
            x_range=[0, 5, 1],
            y_range=[0, 5, 1],
            axis_config={"color": GRAY_A},
            tips=False,
        )

        axes.get_x_axis().set_label_height(0.4)
        axes.get_y_axis().set_label_height(0.4)

        # Add axis labels
        x_label = Text("log(Avalanche Size)", font_size=24)
        x_label.next_to(axes.get_x_axis(), DOWN)

        y_label = Text("log(Frequency)", font_size=24)
        y_label.next_to(axes.get_y_axis(), LEFT, buff=0.3)
        y_label.rotate(PI / 2)

        # Create power-law data points
        x_vals = np.array([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5])
        y_vals = 4.5 - 0.8 * x_vals + np.random.normal(0, 0.15, len(x_vals))
        y_vals = np.clip(y_vals, 0.5, 4.5)

        # Plot points
        dots = VGroup()
        for x, y in zip(x_vals, y_vals):
            dot = Dot(point=axes.coords_to_point(x, y), color=BLUE, radius=0.08)
            dots.add(dot)

        # Fit line
        z = np.polyfit(x_vals, y_vals, 1)
        p = np.poly1d(z)
        x_line = np.linspace(0, 5, 100)
        y_line = p(x_line)

        line = axes.plot(
            lambda x: p(x),
            x_range=[0, 5],
            color=RED,
            stroke_width=3
        )

        # Add title
        title = Text("Power-Law Distribution", font_size=40, color=BLUE_D)
        title.to_edge(UP)

        # Animations
        self.add(axes, x_label, y_label, title)
        self.wait(1)

        # Animate data points
        for dot in dots:
            self.play(Create(dot), run_time=0.2)
        self.wait(0.5)

        # Draw fit line
        self.play(Create(line), run_time=1)
        self.wait(2)

        # Add label for slope
        slope_label = Text(f"Slope ≈ -1.58 (Power Law)", font_size=24, color=RED)
        slope_label.to_edge(DOWN)
        self.play(Write(slope_label), run_time=0.5)
        self.wait(2)


class FractalPattern(Scene):
    """Display fractal pattern from sandpile initial state"""

    def construct(self):
        title = Text("Fractal Geometry in Sandpiles", font_size=48, color=BLUE_D)
        title.to_edge(UP)
        self.add(title)

        # Create fractal-like pattern using nested squares
        fractal = VGroup()

        def create_fractal(center, size, depth, color):
            if depth == 0:
                return

            square = Square(side_length=size, stroke_width=1.5,
                          stroke_color=color, fill_color=color,
                          fill_opacity=0.3)
            square.move_to(center)
            fractal.add(square)

            # Recursive calls for smaller squares at corners
            if depth > 1:
                new_size = size / 3
                offset = size / 3

                for dx, dy in [(1, 1), (1, -1), (-1, 1), (-1, -1)]:
                    new_center = center + np.array([dx * offset, dy * offset, 0])
                    create_fractal(new_center, new_size, depth - 1, color)

        create_fractal(ORIGIN, 4, 4, BLUE)

        self.play(Create(fractal, lag_ratio=0.05), run_time=3)
        self.wait(1)

        # Zoom in to show self-similarity
        self.play(fractal.animate.scale(2), run_time=1)
        self.wait(1)


class CriticalExponent(Scene):
    """Show how power-law exponent relates to criticality"""

    def construct(self):
        # Create comparison of exponents
        title = Text("Critical Exponents", font_size=48)
        title.to_edge(UP)

        # Three different power laws
        exponents = [0.5, 1.5, 2.5]
        labels = ["α = 0.5\n(Weak)", "α = 1.5\n(Critical)", "α = 2.5\n(Steep)"]

        plots = VGroup()

        for i, (alpha, label) in enumerate(zip(exponents, labels)):
            # Axes
            ax = Axes(
                x_range=[0.1, 3, 1],
                y_range=[0, 3, 1],
                width=2.5,
                height=2,
                axis_config={"font_size": 16},
                tips=False,
            )

            # Power law curve
            curve = ax.plot(lambda x: 2 * x ** (-alpha), x_range=[0.2, 3],
                           color=[RED, YELLOW, BLUE][i])

            # Label
            label_text = Text(label, font_size=16)
            label_text.next_to(ax, DOWN, buff=0.2)

            plot_group = VGroup(ax, curve, label_text)
            plot_group.shift(i * 3.5 * RIGHT - 3.5 * RIGHT)
            plots.add(plot_group)

        # Add to scene
        self.add(title)
        self.wait(0.5)

        for plot in plots:
            self.play(Create(plot[0]), Create(plot[1]), Write(plot[2]),
                     run_time=1)

        self.wait(2)


if __name__ == "__main__":
    # Render with: manimgl sandpile_animation.py SandpileIntro -ql --write_to_movie
    pass
