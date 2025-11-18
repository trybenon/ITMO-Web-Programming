package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.Point;
import model.Result;
import util.SessionStorage;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@WebServlet("/checkArea")
public class CheckAreaServlet extends HttpServlet {
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            double startTime = System.nanoTime();
            double x = Double.parseDouble(req.getParameter("x"));
            double y = Double.parseDouble(req.getParameter("y"));
            double r = Double.parseDouble(req.getParameter("r"));
            Point point = new Point(x, y, r);

            var session = req.getSession();
            var storage = (SessionStorage) session.getAttribute("sessionStorage");
            if (storage == null) {
                storage = new SessionStorage();
                session.setAttribute("sessionStorage", storage);
            }

            String current_time = LocalDateTime.now().format(formatter);
            String execution_time = String.format("%.2f", (System.nanoTime() - startTime) / 1000000);

            Result result = new Result(x, y, r, point.hit(), current_time, execution_time);
            storage.addResult(result);

                resp.sendRedirect(req.getContextPath() +"/result.jsp");
        } catch (Exception e) {
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}